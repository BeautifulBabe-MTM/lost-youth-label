import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, audioUrl, coverUrl, rosterMemberId, spotifyUrl, appleMusicUrl } = body;

    const newRelease = await prisma.release.create({
      data: {
        title,
        audioUrl,
        coverUrl,
        rosterMemberId,
        spotifyUrl,
        appleMusicUrl,
      },
    });

    return NextResponse.json(newRelease, { status: 201 });
  } catch (error: any) {
    console.error("RELEASE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}