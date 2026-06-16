import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, bio, imageUrl, instagram, spotify, telegram } = body;

    const newMember = await prisma.rosterMember.create({
      data: {
        name,
        role,
        bio,
        imageUrl,
        instagram,
        spotify,
        telegram: telegram || null,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error: any) {
    console.error("ROSTER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const members = await prisma.rosterMember.findMany({
      select: { id: true, name: true } // берем только нужные поля
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка загрузки ростера" }, { status: 500 });
  }
}