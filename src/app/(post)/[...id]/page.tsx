import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { tags } from './html-tag-styles';
import { Header, PostContent } from './header';
import { getPost } from '@/app/get-posts';
import { allPosts } from 'content-collections';

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post.id.split('/'),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const postId = (await params).id.join('/');
  const post = await getPost({ postId });

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  return (
    <div className="text-sm font-menlo prose prose-neutral dark:prose-invert">
      <Header post={post as PostContent} />
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ ...tags }}
      >
        {post.content}
      </Markdown>
    </div>
  );
}
