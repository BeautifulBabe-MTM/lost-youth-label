import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Vercel Blob SDK автоматически дописывает pathname в query string или body
    let pathname = searchParams.get('pathname');

    // Если в query нет, попробуем забрать из body
    if (!pathname) {
      const body = await request.json().catch(() => ({}));
      pathname = body.pathname;
    }

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      pathname: pathname || 'unnamed-file',
      onUploadCompleted: {
        callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/upload/callback`,
      }
    });

    return NextResponse.json({ clientToken });
  } catch (error: any) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: 'Не удалось сгенерировать токен' }, { status: 500 });
  }
}