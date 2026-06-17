import { NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "@/app/lib/order-service"; // Проверь, чтобы путь к твоему сервису выдачи был правильным

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    
    // Проверяем подпись безопасности, которую мы указали в панели Лемона и в .env
    const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    // Если подпись не совпадает — кто-то левый шлёт запросы, шлём его нахер
    if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
      return new Response("Invalid signature.", { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;

    // Срабатывает, когда клиент успешно оплатил
    if (eventName === "order_created") {
      const customData = payload.meta.custom_data;
      const orderId = customData?.orderId; // Наш ID заказа, который мы передавали при создании чекаута

      if (!orderId) {
        return new Response("Missing orderId in custom data", { status: 400 });
      }

      console.log(`🔔 Получено уведомление от Lemon Squeezy для заказа: ${orderId}`);
      
      // Вызываем наш универсальный сервис, который закроет заказ в MongoDB
      await fulfillOrder(orderId);
    }

    return new Response("OK", { status: 200 });

  } catch (error: any) {
    console.error("🚨 LEMON_SQUEEZY WEBHOOK ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}