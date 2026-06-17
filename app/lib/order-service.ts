import { prisma } from "@/app/lib/db";

// Эту функцию будет вызывать любой вебхук (Paypal, Cryptomus, Lemon Squeezy и т.д.)
export async function fulfillOrder(orderId: string) {
  // 1. Находим заказ и бит
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { beat: true }
  });

  if (!order) throw new Error("Order not found");
  if (order.status === "PAID") return; // Уже обработан, выходим

  // 2. ЗАЩИТА ЭКСКЛЮЗИВА: Если куплен эксклюзив, проверяем, не купил ли его кто-то махом раньше
  if (order.licenseType === "exclusive") {
    // Ищем, нет ли уже УСПЕШНОГО заказа на этот же бит с типом exclusive
    const alreadySoldExclusive = await prisma.order.findFirst({
      where: {
        beatId: order.beatId,
        licenseType: "exclusive",
        status: "PAID"
      }
    });

    if (alreadySoldExclusive) {
      // Если кто-то успел купить эксклюзив на секунду раньше, меняем статус на FAILED
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" }
      });
      // Тут можно залогировать ошибку, чтобы вернуть чуваку деньги руками
      throw new Error("This exclusive has already been sold to someone else");
    }
  }

  // 3. Обновляем статус заказа на PAID
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" }
  });

  // 4. Логика выдачи файла в зависимости от лицензии
  let downloadUrl = order.beat.audioUrl; // Превью по дефолту
  if (order.licenseType === "mp3") downloadUrl = order.beat.mp3FileUrl || downloadUrl;
  if (order.licenseType === "wav") downloadUrl = order.beat.wavFileUrl || downloadUrl;
  if (order.licenseType === "exclusive") downloadUrl = order.beat.stemsFileUrl || downloadUrl;

  console.log(`✨ Заказ ${orderId} успешно закрыт. Ссылка для клиента: ${downloadUrl}`);

  // 5. ОТПРАВКА НА ПОЧТУ (Сюда мы потом прикрутим Resend / Nodemailer)
  // await sendEmailWithLinks(order.customerEmail, downloadUrl, order.beat.title);

  return downloadUrl;
}