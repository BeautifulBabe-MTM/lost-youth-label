import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename') || 'beat.mp3';

        // ПРОВЕРКА 1: Видит ли сервер файл?
        if (!request.body) {
            console.error("❌ Файл не пришел в теле запроса");
            return NextResponse.json({ error: "No file body" }, { status: 400 });
        }

        // ПРОВЕРКА 2: Видит ли сервер токен?
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error("❌ ТОКЕН ОТСУТСТВУЕТ В .ENV.LOCAL");
            return NextResponse.json({ error: "Token missing" }, { status: 500 });
        }

        console.log(`Начинаю загрузку файла: ${filename}...`);

        const blob = await put(filename, request.body, {
            access: 'public',
        });

        console.log("✅ Успешно! Ссылка:", blob.url);
        return NextResponse.json(blob);

    } catch (error: any) {
        console.error("❌ ОШИБКА VERCEL BLOB:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}