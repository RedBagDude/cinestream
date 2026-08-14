import { NextRequest, NextResponse } from 'next/server';
import { searchMulti } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json({ results: [] });
  const data = await searchMulti(q, 1);
  return NextResponse.json({ results: data.results.slice(0, 6) });
}
