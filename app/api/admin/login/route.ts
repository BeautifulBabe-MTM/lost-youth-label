import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        console.log("ПРИШЛО ИЗ ФОРМЫ:", password);
        console.log("ЛЕЖИТ В .ENV:", process.env.ADMIN_SECRET_KEY);

        if (password === process.env.ADMIN_SECRET_KEY) {
            const response = NextResponse.json({ success: true });

            // Ставим защищенную куку на 7 дней
            response.cookies.set('lost_youth_admin_session', 'authenticated_true', {
                httpOnly: true, // Защита от XSS атак (скрипты не смогут прочитать куку)
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 неделя
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'ДОСТУП ЗАПРЕЩЕН' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'ОШИБКА СЕРВЕРА' }, { status: 500 });
    }
}