import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, genre, bpm, price, audioUrl, authorId } = body;

    const newBeat = await prisma.beat.create({
      data: {
        title,
        genre,
        bpm: parseInt(bpm),
        price: parseFloat(price),
        audioUrl,
        authorId, // ID продюсера из твоего ростера
      },
    });

    return NextResponse.json(newBeat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при добавлении бита" }, { status: 500 });
  }
}