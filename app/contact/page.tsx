import ContactForm from "@/app/components/ContactForm";

export const metadata = {
  title: "CONTACT // LOST YOUTH",
  description: "Join the roster or order custom production from Lost Youth Label.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-6xl mx-auto font-sans">
      
      <header className="mb-16 border-b border-zinc-900 pb-8 mt-6">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-3 italic">
          Сотрудничество / <span className="text-zinc-600">СВЯЗЬ</span>
        </h1>
        <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">
          Lost Youth Label Глобальная Инфраструктура & Демо Дроп
        </p>
      </header>

      {/* Двухколоночный грид */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ЛЕВАЯ КОЛОНКА: ИНФО И ПРЯМЫЕ СВЯЗИ */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
              // ПРАВИЛА ОТПРАВКИ ДЕМО
            </h3>
            <p className="text-xs uppercase text-zinc-500 tracking-wide leading-relaxed">
              Мы ищем уникальный, сырой звук. Drill, экспериментальный Trap, джерси и плотный андеграунд. 
              Присылайте только ссылки на стриминги или облака (SoundCloud, Google Drive, Yandex). 
              Файлы, прикрепленные к письмам напрямую, автоматически удаляются.
            </p>
          </div>

          <div className="border-t border-zinc-900 pt-8 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
              // Контакты
            </h3>
            
            {/* Ссылки-карточки */}
            <div className="flex flex-col gap-3">
              <a 
                href="https://t.me/lostyouthlabel" 
                target="_blank" 
                className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-4 hover:border-white transition group font-mono text-xs"
              >
                <span className="font-sans font-black uppercase tracking-wider">TELEGRAM</span>
                <span className="text-zinc-600 group-hover:text-white transition">@lostyouthlabel →</span>
              </a>

              <a 
                href="mailto:cooperate@lostyouth.ru" 
                className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-4 hover:border-white transition group font-mono text-xs"
              >
                <span className="font-sans font-black uppercase tracking-wider">BOOKING & INFO</span>
                <span className="text-zinc-600 group-hover:text-white transition">cooperate@lostyouth.com →</span>
              </a>

              <a 
                href="https://soundcloud.com" 
                target="_blank" 
                className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-4 hover:border-white transition group font-mono text-xs"
              >
                <span className="font-sans font-black uppercase tracking-wider">SOUNDCLOUD</span>
                <span className="text-zinc-600 group-hover:text-white transition">LOST YOUTH REC →</span>
              </a>
            </div>
          </div>

          <div className="bg-zinc-950 border border-dashed border-zinc-900 p-6 font-mono text-[10px] text-zinc-600 uppercase space-y-1">
            <div>Статус: Набор открыт</div>
            <div>Время ответа: 24-48 ЧАСОВ</div>
            <div>Локация: Удалённо / Глобально</div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 block lg:hidden">
            // СВЯЗАТЬСЯ ЧЕРЕЗ САЙТ
          </h3>
          <ContactForm />
        </div>

      </div>
    </main>
  );
}