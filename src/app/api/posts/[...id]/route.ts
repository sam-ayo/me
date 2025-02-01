import { getPost } from '@/app/get-posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');
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
  const post = await getPost({ postId });
  return NextResponse.json(post);
}
