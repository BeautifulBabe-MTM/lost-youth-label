import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { beatId, licenseType, email, beatTitle } = await request.json();

        if (!beatId || !licenseType || !email || !beatTitle) {
            return NextResponse.json({ message: "Отсутствуют обязательные данные заказа" }, { status: 400 });
        }
        
        const beat = await prisma.beat.findUnique({
            where: { id: beatId }
        });

        if (!beat) {
            return NextResponse.json({ message: "Бит не найден" }, { status: 404 });
        }

        const beatData = beat as any;
        let finalPriceUsd = Number(beatData.price || 0);

        if (licenseType === "wav") {
            finalPriceUsd = beatData.priceWav ? Number(beatData.priceWav) : finalPriceUsd * 2;
        } else if (licenseType === "exclusive") {
            finalPriceUsd = beatData.priceExclusive ? Number(beatData.priceExclusive) : finalPriceUsd * 6;
        }

        const order = await prisma.order.create({
            data: {
                beatId: beat.id,
                licenseType: licenseType,
                customerEmail: email,
                amount: finalPriceUsd,
                currency: "USD",
                paymentMethod: "card",
                provider: "wayforpay",
                status: "PENDING"
            }
        });

        const merchantAccount = "lost_youth_netlify_app";
        const secretKey = process.env.WAYFORPAY_SECRET_KEY;
        const siteUrl = "https://lost-youth.netlify.app";
        
        if (!secretKey) {
            return NextResponse.json({ message: "Не задан WAYFORPAY_SECRET_KEY в .env" }, { status: 500 });
        }

        const merchantDomainName = "lost-youth.netlify.app";
        const orderId = order.id;
        const orderDate = Math.floor(Date.now() / 1000);
        const amount = finalPriceUsd;
        const currency = "USD";
        const productName = `License ${licenseType.toUpperCase()}: ${beat.title}`;
        const productCount = 1;
        const productPrice = amount;

        // Строка для подписи
        const stringToSign = [
            merchantAccount,
            merchantDomainName,
            orderId,
            orderDate,
            amount,
            currency,
            productName,
            productCount,
            productPrice
        ].join(';');

        const merchantSignature = crypto
            .createHmac("md5", secretKey)
            .update(stringToSign)
            .digest("hex");

        // Возвращаем чистые данные для формы
        return NextResponse.json({
            formData: {
                merchantAccount,
                merchantAuthType: "SimpleSignature",
                merchantDomainName,
                merchantSignature,
                orderReference: orderId,
                orderDate: orderDate.toString(),
                amount: amount.toString(),
                currency,
                "productName[]": productName,
                "productCount[]": productCount.toString(),
                "productPrice[]": productPrice.toString(),
                returnUrl: `${siteUrl}/order/success?orderId=${orderId}`,
                serviceUrl: `${siteUrl}/api/webhooks/wayforpay`,
                clientEmail: email
            }
        });

    } catch (error: any) {
        console.error("WAYFORPAY_INTEGRATION_ERROR:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}