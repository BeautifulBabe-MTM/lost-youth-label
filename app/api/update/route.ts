import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {

  try {
    const body = await req.json();
    const { id, type, data } = body;
    if (type === 'beat') {
      await prisma.beat.update({
        where: { id },
        data: {
          title: data.title,
          bpm: parseInt(data.bpm),
          price: parseFloat(data.price),
          genre: data.genre,
          rosterMemberId: data.rosterMemberId || null,
        }
      });
    } else {
      await prisma.release.update({
        where: { id },
        data: {
          title: data.title,
          feat: data.feat || null,
        }
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 });
  }
}