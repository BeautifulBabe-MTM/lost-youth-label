'use client';

import { useState } from 'react';

// Строгий интерфейс на основе нашей Prisma-модели для MongoDB
interface Beat {
  id: string;
  title: string;
  price: number;            // Это базовая цена (MP3)
  priceWav?: number | null;
  priceExclusive?: number | null;
}

interface PurchaseModalProps {
  beat: Beat;
  isOpen: boolean;
  onClose: () => void;
}

export default function BeatPurchaseModal({ beat, isOpen, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [license, setLicense] = useState<'mp3' | 'wav' | 'exclusive'>('wav');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const getLicensePrice = (type: 'mp3' | 'wav' | 'exclusive') => {
    if (type === 'mp3') return beat.price;
    if (type === 'wav') return beat.priceWav || (beat.price * 2);
    if (type === 'exclusive') return beat.priceExclusive || (beat.price * 6);
    return beat.price;
  };

  const currentPrice = getLicensePrice(license);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      try {
        setIsLoading(true);

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            beatId: beat.id,
            licenseType: license, // "mp3" | "wav" | "exclusive"
            email: email,
            beatPrice: currentPrice,
            beatTitle: beat.title,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Ошибка при создании сессии оплаты");
        }

        // Проверяем, прилетел ли объект формы от WayForPay с бэкенда
        if (data.formData) {
          // 1. Создаем скрытую форму программно
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://secure.wayforpay.com/pay";
          form.acceptCharset = "utf-8";

          // 2. Набиваем инпутами из прилетевшего formData
          Object.entries(data.formData).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          });

          // 3. Добавляем в документ и триггерим POST-отправку
          document.body.appendChild(form);
          form.submit();

          // Удаляем за собой, чтобы не засорять DOM
          document.body.removeChild(form);
        } else {
          alert("Не удалось сгенерировать данные для WayForPay.");
        }

      } catch (error: any) {
        console.error("Ошибка фронтенда при покупке:", error);
        alert(`Критическая ошибка: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const licenseOptions = [
    { id: 'mp3', name: 'MP3 Lease', desc: 'Стриминг до 10k прослушиваний' },
    { id: 'wav', name: 'WAV Lease', desc: 'Высокое качество + Стриминг до 100k' },
    { id: 'exclusive', name: 'Exclusive', desc: 'Полные права, TRACKOUT/STEMS, снятие с продажи' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-900 p-8 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition font-mono text-xs uppercase tracking-widest"
        >
          [ закрыть ]
        </button>

        <header className="mb-8 border-b border-zinc-900 pb-4">
          <span className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-mono block mb-1">
            // checkout терминал
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
            {beat.title} <span className="text-zinc-600">/ покупка</span>
          </h2>
        </header>

        <form onSubmit={handleNextStep} className="space-y-6">
          {step === 1 ? (
            <>
              {/* 1. ВЫБОР ЛИЦЕНЗИИ */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">// 1. ТИП ЛИЦЕНЗИИ</label>

                <div className="grid grid-cols-1 gap-2">
                  {licenseOptions.map((item) => {
                    const priceForItem = getLicensePrice(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex justify-between items-center p-4 border border-zinc-900 cursor-pointer transition select-none bg-black ${license === item.id ? 'border-white bg-zinc-900/40' : 'hover:border-zinc-700'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="license"
                            checked={license === item.id}
                            onChange={() => setLicense(item.id)}
                            className="accent-white"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-wide text-white">{item.name}</span>
                            <span className="text-[10px] text-zinc-500 uppercase">{item.desc}</span>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-white">${priceForItem}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. ВЫБОР СПОСОБА ОПЛАТЫ */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">// 2. МЕТОД ОПЛАТЫ</label>

                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 border border-zinc-900 bg-black cursor-pointer transition select-none ${paymentMethod === 'card' ? 'border-white bg-zinc-900/40' : 'hover:border-zinc-700'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-white"
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-white">CARD / APPLE PAY</span>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border border-zinc-900 bg-black cursor-pointer transition select-none ${paymentMethod === 'crypto' ? 'border-white bg-zinc-900/40' : 'hover:border-zinc-700'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'crypto'}
                      onChange={() => setPaymentMethod('crypto')}
                      className="accent-white"
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-white">CRYPTO (USDT)</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ШАГ 2: ВВОД ПОЧТЫ ДЛЯ СКАЧИВАНИЯ */}
              <div className="space-y-3 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[10px] text-zinc-500 hover:text-white uppercase font-mono tracking-widest bg-transparent border-none p-0 cursor-pointer"
                >
                  ← назад к выбору
                </button>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
                    // КУДА ОТПРАВИТЬ ССЫЛКУ НА СКАЧИВАНИЕ?
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="YOUR-EMAIL@GENIUS.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-4 outline-none focus:border-white transition font-mono text-sm text-white"
                  />
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wide leading-relaxed">
                    После подтверждения транзакции платежной системой, на этот адрес мгновенно придет защищенная ссылка на скачивание архива (WAV/MP3 + Стем-файлы).
                  </p>
                </div>

                {/* Чек-лог */}
                <div className="bg-zinc-900/30 border border-zinc-900 p-4 font-mono text-[10px] text-zinc-400 uppercase space-y-1">
                  <div className="flex justify-between"><span>Товар:</span> <span className="text-white">{beat.title}</span></div>
                  <div className="flex justify-between"><span>Лицензия:</span> <span className="text-white">{license}</span></div>
                  <div className="flex justify-between"><span>Шлюз:</span> <span className="text-white">{paymentMethod}</span></div>
                  <div className="border-t border-zinc-900 my-2 pt-2 flex justify-between font-bold">
                    <span>Итого к оплате:</span>
                    <span className="text-emerald-500">${currentPrice}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-black p-5 uppercase tracking-[0.3em] text-xs hover:bg-zinc-200 transition active:scale-[0.99] mt-4"
          >
            {step === 1 ? 'ПРОДОЛЖИТЬ' : `ОПЛАТИТЬ $${currentPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}