import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { beatId, licenseType, email } = await req.json();

        if (!beatId || !licenseType || !email) {
            return NextResponse.json({ message: "Заполните все поля и email" }, { status: 400 });
        }

        // 1. Находим бит в базе данных
        const beat = await prisma.beat.findUnique({
            where: { id: beatId }
        });

        if (!beat) {
            return NextResponse.json({ message: "Бит не найден" }, { status: 404 });
        }

        // 2. Считаем цену (кастим к any, чтобы TS не выебывался на скрытые поля схемы)
        const beatData = beat as any;
        let finalPriceUsd = Number(beatData.price || 0);

        if (licenseType === "wav") {
            finalPriceUsd = beatData.priceWav ? Number(beatData.priceWav) : finalPriceUsd * 2;
        } else if (licenseType === "exclusive") {
            finalPriceUsd = beatData.priceExclusive ? Number(beatData.priceExclusive) : finalPriceUsd * 10;
        }

        // На всякий случай проверка, если цена осталась нулевой или кривой
        if (!finalPriceUsd || isNaN(finalPriceUsd)) {
            return NextResponse.json({ message: "Ошибка расчета стоимости бита" }, { status: 400 });
        }

        // AAIO работает в рублях (RUB). Конвертируем по курсу.
        const exchangeRate = 95;
        const finalAmountRub = Math.round(finalPriceUsd * exchangeRate);

        // 3. Создаем запись о незавершенном заказе (инвойсе) в нашей MongoDB
        const order = await prisma.order.create({
            data: {
                beatId: beat.id,
                licenseType: licenseType, // "mp3" | "wav" | "exclusive"
                customerEmail: email,     // Поменяли buyerEmail на customerEmail, как в схеме
                amount: finalAmountRub,
                currency: "USD",          // Твоя призма ждет строку, закинули дефолт
                paymentMethod: "card",    // Или "crypto" в зависимости от выбора, пока пишем card
                status: "PENDING"
            }
        });

        // 4. Параметры мерчанта AAIO
        const merchantId = process.env.AAIO_MERCHANT_ID!;
        const secretKey1 = process.env.AAIO_SECRET_KEY_1!;
        const orderId = order.id;
        const currency = "RUB";
        const desc = `LOST YOUTH: ${beatData.title?.toUpperCase() || "BEAT"} (${licenseType.toUpperCase()})`;

        // 5. Генерируем SHA-256 подпись по правилам AAIO
        const signatureSource = `${merchantId}:${finalAmountRub}:${currency}:${secretKey1}:${orderId}`;
        const sign = crypto.createHash("sha256").update(signatureSource).digest("hex");

        // 6. Формируем финальный URL оплаты для редиректа
        const paymentUrl = new URL("https://aaio.io/merchant/pay");
        paymentUrl.searchParams.append("merchant_id", merchantId);
        paymentUrl.searchParams.append("amount", finalAmountRub.toString());
        paymentUrl.searchParams.append("currency", currency);
        paymentUrl.searchParams.append("order_id", orderId);
        paymentUrl.searchParams.append("sign", sign);
        paymentUrl.searchParams.append("desc", desc);
        paymentUrl.searchParams.append("email", email);

        return NextResponse.json({ url: paymentUrl.toString() });

    } catch (error: any) {
        console.error("AAIO_CHECKOUT_ERROR:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}