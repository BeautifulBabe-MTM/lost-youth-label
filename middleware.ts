import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Поправил импорт типов для Next.js

export function middleware(request: NextRequest) {
  const session = request.cookies.get('lost_youth_admin_session');
  const { pathname } = request.nextUrl;

  // Если юзер ломится в админку, но у него нет куки сессии
  if (pathname.startsWith('/admin') && !session) {
    // Используем стандартный класс URL, передавая базовый URL запроса вторым аргументом
    const loginUrl = new URL('/admin-login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Конфиг указывает Next.js триггерить этот файл только на страницах админки
export const config = {
  matcher: ['/admin/:path*'],
};