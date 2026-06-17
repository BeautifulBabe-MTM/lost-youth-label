import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import crypto from "crypto";
import { sendEmailWithBeat } from "@/app/lib/email"; // Функцию отправки сделаем следующим шагом

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type") || "";
        let data: any = {};

        if (contentType.includes("application/json")) {
            data = await request.json();
        } else {
            const formData = await request.formData();
            formData.forEach((value, key) => {
                data[key] = value;
            });
        }

        console.log("[WayForPay Webhook] Получены данные:", data);

        const {
            merchantAccount,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode,
            merchantSignature
        } = data;

        if (!orderReference || !merchantSignature) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const secretKey = process.env.WAYFORPAY_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json({ error: "Internal config error" }, { status: 500 });
        }

        // Проверка подписи от WayForPay, чтобы никто не прислал фейковый успех
        const stringToSign = [
            merchantAccount,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode
        ].join(';');

        const expectedSignature = crypto
            .createHmac("md5", secretKey)
            .update(stringToSign)
            .digest("hex");

        if (merchantSignature !== expectedSignature) {
            console.error("[WayForPay Webhook] Неверная подпись!");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // Если платёж прошёл успешно
        if (transactionStatus === "Approved") {
            console.log(`[WayForPay Webhook] Заказ ${orderReference} ОПЛАЧЕН.`);

            // 1. Обновляем статус заказа и подтягиваем инфу о самом бите
            const updatedOrder = await prisma.order.update({
                where: { id: orderReference },
                data: {
                    status: "PAID",
                    updatedAt: new Date()
                },
                include: {
                    beat: true
                }
            });

            // 2. Если куплена лицензия "exclusive" — убираем бит из продажи
            if (updatedOrder.licenseType === "exclusive") {
                console.log(`[WayForPay Webhook] Exclusive куплен! Маркируем бит ${updatedOrder.beatId} как проданный.`);
                await prisma.beat.update({
                    where: { id: updatedOrder.beatId },
                    data: { isSold: true }
                });
            }

            // 3. Отправляем файлы на email клиента
            try {
                await sendEmailWithBeat(updatedOrder.customerEmail, updatedOrder.beat.title, updatedOrder.licenseType);
            } catch (mailError) {
                console.error("[WayForPay Webhook] Ошибка отправки письма:", mailError);
            }

        } else {
            // Если транзакция отклонена банком, упала по таймауту и т.д.
            await prisma.order.update({
                where: { id: orderReference },
                data: {
                    status: "FAILED",
                    updatedAt: new Date()
                }
            });
        }

        // Обязательный ответ для WayForPay, чтобы они не слали этот вебхук повторно
        const responseTime = Math.floor(Date.now() / 1000);
        const stringToSignResponse = [orderReference, "accept", responseTime].join(';');
        const responseSignature = crypto
            .createHmac("md5", secretKey)
            .update(stringToSignResponse)
            .digest("hex");

        return NextResponse.json({
            orderReference,
            status: "accept",
            time: responseTime,
            signature: responseSignature
        });

    } catch (error: any) {
        console.error("[WayForPay Webhook] Критическая ошибка:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}