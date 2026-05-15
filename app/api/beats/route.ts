import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, genre, bpm, price, audioUrl, rosterMemberId } = body;

        const newBeat = await prisma.beat.create({
            data: {
                title,
                genre,
                bpm: parseInt(bpm),
                price: parseFloat(price),
                audioUrl,
                rosterMemberId: rosterMemberId,
            },
        });

        return NextResponse.json(newBeat, { status: 201 });
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        return NextResponse.json({ error: "Ошибка при добавлении бита" }, { status: 500 });
    }
}