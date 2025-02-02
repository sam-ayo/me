import { NextRequest, NextResponse } from 'next/server';
import { cacheClient } from '../../../../redis';

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  const noOfViews = (await cacheClient.get(postId)) as number;

  if (!noOfViews) {
    await cacheClient.set(postId, 1);
    return NextResponse.json({ message: 1 });
  }

  const setResult = await cacheClient.set(postId, noOfViews + 1);
  if (setResult === 'OK') {
    return NextResponse.json({ message: noOfViews + 1 });
  }

  return NextResponse.json({ message: noOfViews });
}
