import { Resend } from 'resend';

// Инициализируем Resend с помощью ключа из .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailWithBeat(customerEmail: string, beatTitle: string, licenseType: string) {
  const isExclusive = licenseType.toLowerCase() === 'exclusive';
  
  // Базовый домен твоего сайта для ссылок
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lost-youth.netlify.app';

  await resend.emails.send({
    // Пока нет своего домена, Resend разрешает отправлять только с этого адреса:
    from: 'Lost Youth Market <onboarding@resend.dev>', 
    to: customerEmail,
    subject: `LOST YOUTH // Твой бит: ${beatTitle.toUpperCase()}`,
    html: `
      <div style="background-color: #000000; color: #ffffff; padding: 50px 20px; font-family: 'Courier New', Courier, monospace; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
        
        <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 10px; color: #ffffff;">
          LOST YOUTH
        </h1>
        <p style="color: #666666; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 40px;">
          Независимый лейбл // Маркет битов
        </p>
        
        <div style="border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; padding: 30px 0; margin-bottom: 40px;">
          <p style="color: #888888; font-size: 12px; text-transform: uppercase; tracking: 1px; margin: 0 0 10px 0;">
            Успешная оплата заказа
          </p>
          <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase; margin: 0; letter-spacing: 1px;">
            ${beatTitle}
          </h2>
          <p style="color: ${isExclusive ? '#ff3333' : '#ffffff'}; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 15px 0 0 0; letter-spacing: 2px;">
            Лицензия: ${licenseType.toUpperCase()} ${isExclusive ? '• [ПРОДАНО]' : ''}
          </p>
        </div>

        <p style="color: #aaaaaa; font-size: 13px; line-height: 1.6; margin-bottom: 40px; padding: 0 20px;">
          Спасибо за фидбек и покупку, бро. Твои файлы готовы к загрузке. Нажми на кнопку ниже, чтобы перейти на страницу скачивания треков (WAV / Stems / Договор).
        </p>

        <div style="margin-bottom: 50px;">
          <a href="${siteUrl}/downloads?email=${encodeURIComponent(customerEmail)}" 
             style="background-color: #ffffff; color: #000000; padding: 18px 35px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block; transition: all 0.3s ease;">
            Скачать файлы бита
          </a>
        </div>

        <p style="color: #444444; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; margin-top: 60px;">
          © ${new Date().getFullYear()} LOST YOUTH COLLECTIVE. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
        </p>
      </div>
    `,
  });
}