import { getPostViews } from '@/app/get-posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const views = await getPostViews();
  return NextResponse.json(views);
}
