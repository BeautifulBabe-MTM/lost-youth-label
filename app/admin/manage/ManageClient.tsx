"use client";
import { useState } from 'react';
import { Trash2, Music, Disc, Edit3, X, Check } from 'lucide-react';
import Image from 'next/image';

export default function ManageClient({ initialBeats, initialReleases }: any) {
    const [tab, setTab] = useState<'beats' | 'releases'>('beats');
    const [beats, setBeats] = useState(initialBeats);
    const [releases, setReleases] = useState(initialReleases);

    const [editingItem, setEditingItem] = useState<any>(null);

    const handleDelete = async (id: string, type: 'beat' | 'release') => {
        if (!confirm("Удалить безвозвратно?")) return;
        const res = await fetch("/api/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, type })
        });
        if (res.ok) {
            if (type === 'beat') setBeats(beats.filter((b: any) => b.id !== id));
            else setReleases(releases.filter((r: any) => r.id !== id));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const type = tab === 'beats' ? 'beat' : 'release';

        const res = await fetch("/api/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingItem.id, type, data: editingItem })
        });

        if (res.ok) {
            if (type === 'beat') {
                setBeats(beats.map((b: any) => b.id === editingItem.id ? editingItem : b));
            } else {
                setReleases(releases.map((r: any) => r.id === editingItem.id ? editingItem : r));
            }
            setEditingItem(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* ПЕРЕКЛЮЧАТЕЛЬ */}
            <div className="flex gap-4 border-b border-zinc-900 pb-4">
                <button
                    onClick={() => setTab('beats')}
                    className={`flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${tab === 'beats' ? 'text-white border-b-2 border-white' : 'text-zinc-600'}`}
                >
                    <Music size={14} /> Биты ({beats.length})
                </button>
                <button
                    onClick={() => setTab('releases')}
                    className={`flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${tab === 'releases' ? 'text-white border-b-2 border-white' : 'text-zinc-600'}`}
                >
                    <Disc size={14} /> Релизы ({releases.length})
                </button>
            </div>

            <div className="overflow-hidden border border-zinc-900 bg-zinc-950/30">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold tracking-widest text-[9px]">
                        <tr>
                            {tab === 'beats' ? (
                                <>
                                    <th className="p-4 border-b border-zinc-900">Название</th>
                                    <th className="p-4 border-b border-zinc-900">BPM</th>
                                    <th className="p-4 border-b border-zinc-900">Цена</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-4 border-b border-zinc-900 w-16">Обложка</th>
                                    <th className="p-4 border-b border-zinc-900">Инфо</th>
                                    <th className="p-4 border-b border-zinc-900">Артист</th>
                                </>
                            )}
                            <th className="p-4 border-b border-zinc-900 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                        {(tab === 'beats' ? beats : releases).map((item: any) => (
                            <tr key={item.id} className="hover:bg-zinc-900/40 transition group">
                                {tab === 'beats' ? (
                                    <>
                                        <td className="p-4 font-bold text-white uppercase tracking-tighter">{item.title}</td>
                                        <td className="p-4 text-zinc-500 font-mono">{item.bpm}</td>
                                        <td className="p-4 text-zinc-300 font-bold">${item.price}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4">
                                            <div className="relative w-10 h-10 border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                                                {item.coverUrl ? (
                                                    <Image
                                                        src={item.coverUrl}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Disc size={16} className="text-zinc-700" /> // Иконка-заглушка, если обложки нет
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-white uppercase italic">
                                            {item.title} {item.feat && <span className="text-zinc-600 font-normal tracking-normal text-[10px] ml-1">(ft. {item.feat})</span>}
                                        </td>
                                        <td className="p-4 text-zinc-500 font-bold uppercase">{item.author?.name}</td>
                                    </>
                                )}
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => setEditingItem(item)} className="text-zinc-600 hover:text-white transition">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id, tab === 'beats' ? 'beat' : 'release')} className="text-zinc-800 hover:text-red-500 transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-zinc-900 w-full max-w-md p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Редактировать</h3>
                            <button onClick={() => setEditingItem(null)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Название</label>
                                <input
                                    value={editingItem.title}
                                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="bg-black border border-zinc-800 p-3 text-sm text-white outline-none focus:border-zinc-500 transition"
                                />
                            </div>

                            {tab === 'beats' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">BPM</label>
                                        <input
                                            type="number"
                                            value={editingItem.bpm}
                                            onChange={e => setEditingItem({ ...editingItem, bpm: e.target.value })}
                                            className="bg-black border border-zinc-800 p-3 text-sm text-white outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Цена ($)</label>
                                        <input
                                            type="number"
                                            value={editingItem.price}
                                            onChange={e => setEditingItem({ ...editingItem, price: e.target.value })}
                                            className="bg-black border border-zinc-800 p-3 text-sm text-white outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Фит (Feat.)</label>
                                    <input
                                        value={editingItem.feat || ""}
                                        onChange={e => setEditingItem({ ...editingItem, feat: e.target.value })}
                                        placeholder="Необязательно"
                                        className="bg-black border border-zinc-800 p-3 text-sm text-white outline-none"
                                    />
                                </div>
                            )}

                            <button type="submit" className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition mt-4">
                                Сохранить изменения
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}