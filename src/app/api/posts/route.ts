import { getPost, getPostPreview } from '@/app/get-posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');
  if (postId === null) {
    const postPreviews = await getPostPreview();
    return NextResponse.json(postPreviews);
  }
  const post = await getPost({ postId });
  console.log('Post: ', post);
  return NextResponse.json(post);
}
