import { NextResponse } from 'next/server';

export async function GET() {
  const beats = [
    { id: '1', title: 'Krovostok Style', bpm: 90, price: 30, url: '/demo.mp3' },
    { id: '2', title: 'Drill Shift', bpm: 140, price: 50, url: '/drill.mp3' },
  ];
  
  return NextResponse.json(beats);
}