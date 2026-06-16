import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // AAIO шлёт данные в формате URL-encoded (FormData), а не чистый JSON
    const formData = await req.formData();
    
    const merchant_id = formData.get("merchant_id")?.toString();
    const amount = formData.get("amount")?.toString();
    const order_id = formData.get("order_id")?.toString();
    const payment_id = formData.get("payment_id")?.toString(); // ID операции внутри AAIO
    const sign = formData.get("sign")?.toString();

    if (!merchant_id || !amount || !order_id || !sign) {
      return new Response("Missing required fields", { status: 400 });
    }

    // 1. Проверяем валидность подписи, чтобы никто не подделал платёж
    // Секретный ключ №2 настраивается в кабинете AAIO специально для вебхуков
    const secretKey2 = process.env.AAIO_SECRET_KEY_2!; 
    
    // Формула AAIO для входящего вебхука: merchant_id:amount:order_id:secret_key_2
    const signatureSource = `${merchant_id}:${amount}:${order_id}:${secretKey2}`;
    const calculatedSign = crypto.createHash("sha256").update(signatureSource).digest("hex");

    if (calculatedSign !== sign) {
      console.error("❌ AAIO WEBHOOK: Неверная подпись безопасности!");
      return new Response("Invalid signature", { status: 400 });
    }

    // 2. Ищем заказ в нашей MongoDB
    const order = await prisma.order.findUnique({
      where: { id: order_id },
      include: { beat: true } // Сразу подтягиваем инфу о бите
    });

    if (!order) {
      console.error(`❌ Заказ ${order_id} не найден в базе данных`);
      return new Response("Order not found", { status: 404 });
    }

    // Если заказ уже оплачен — просто отвечаем OK (AAIO может слать вебхук повторно)
    if (order.status === "PAID") {
      return new Response("OK", { status: 200 });
    }

    // 3. Обновляем статус заказа на PAID
    await prisma.order.update({
      where: { id: order_id },
      data: { status: "PAID" }
    });

    console.log(`✅ Заказ ${order_id} успешно оплачен! Бит: ${order.beat.title}`);

    // 4. Твоя логика выдачи товара
    // Определяем, какую ссылку на архив/файл выдать в зависимости от купленной лицензии
    let fileToDownload = order.beat.audioUrl; // Дефолт (превью)
    
    if (order.licenseType === "mp3" && order.beat.mp3FileUrl) {
      fileToDownload = order.beat.mp3FileUrl;
    } else if (order.licenseType === "wav" && order.beat.wavFileUrl) {
      fileToDownload = order.beat.wavFileUrl;
    } else if (order.licenseType === "exclusive" && order.beat.stemsFileUrl) {
      fileToDownload = order.beat.stemsFileUrl;
    }

    // ТУТ НАДО ТЕБЕ РЕШИТЬ: 
    // Вариант А: Отправить письмо с этой ссылкой `fileToDownload` на почту `order.customerEmail` через Resend/Nodemailer.
    // Вариант Б: Перенаправить на страницу /success, где мы по `orderId` покажем кнопку "Скачать".

    // Отвечаем AAIO строкой "OK", чтобы они поняли, что мы всё обработали успешно
    return new Response("OK", { status: 200 });

  } catch (error: any) {
    console.error("🚨 AAIO WEBHOOK ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}