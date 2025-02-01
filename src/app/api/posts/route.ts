import { getPostPreview } from '@/app/get-posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const postPreviews = await getPostPreview();
  return NextResponse.json(postPreviews);
}
