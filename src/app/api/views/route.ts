import { NextRequest, NextResponse } from 'next/server';
import { cacheClient } from '../../../../redis';

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  const noOfViews = (await cacheClient.get(postId)) as number;
  if (!noOfViews) {
    await cacheClient.set(postId, 1);
    return NextResponse.json({ message: 'First view 🚀' });
  }
  await cacheClient.set(postId, noOfViews + 1);
  return NextResponse.json({ message: '+1 view 🔥' });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId') ?? null;
  if (postId === null) {
    return NextResponse.json(
      {
        error: {
          message: 'Missing "id" query',
          code: 'MISSING_ID',
        },
      },
      { status: 400 },
    );
  }
  const noOfViews = (await cacheClient.get(postId)) as number;
  return NextResponse.json({ noOfViews: noOfViews ?? 0 });
}
