import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id, type } = await req.json(); // type: 'beat' | 'release'

  try {
    if (type === 'beat') {
      await prisma.beat.delete({ where: { id } });
    } else {
      await prisma.release.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}