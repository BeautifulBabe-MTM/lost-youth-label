import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Дебаг-лог в консоль сервера хостинга
    console.log("Получена заявка на сотрудничество:", data);

    // TODO: Здесь можно прикрутить отправку в Телеграм-бота или запись в БД
    
    return NextResponse.json({ success: true, message: "Заявка принята" });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка обработки запроса" }, { status: 500 });
  }
}