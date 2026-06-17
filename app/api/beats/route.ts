import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            title, 
            genre, 
            bpm, 
            price, 
            priceWav,
            priceExclusive, 
            audioUrl, 
            mp3FileUrl, 
            wavFileUrl, 
            stemsFileUrl, 
            rosterMemberId 
        } = body;

        const newBeat = await prisma.beat.create({
            data: {
                title,
                genre,
                bpm: parseInt(bpm, 10),
                price: parseFloat(price),
                priceWav: priceWav ? parseFloat(priceWav) : null,
                priceExclusive: priceExclusive ? parseFloat(priceExclusive) : null,
                audioUrl,
                mp3FileUrl: mp3FileUrl || null,
                wavFileUrl: wavFileUrl || null,
                stemsFileUrl: stemsFileUrl || null,
                rosterMemberId: rosterMemberId || null,
                isSold: false,
            },
        });

        return NextResponse.json(newBeat, { status: 201 });
    } catch (error: any) {
        console.error("PRISMA ERROR:", error);
        return NextResponse.json({ error: "Ошибка при добавлении бита", details: error.message }, { status: 500 });
    }
}