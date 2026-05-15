import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const releases = await prisma.release.findMany({
    select: { coverUrl: true },
    distinct: ['coverUrl'], // Берем только уникальные
    orderBy: { id: 'desc' },
    take: 10
  });
  return NextResponse.json(releases.map(r => r.coverUrl));
}