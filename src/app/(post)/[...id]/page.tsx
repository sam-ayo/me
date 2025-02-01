import { getPost } from '@/app/get-posts';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { tags } from './html-tag-styles';
import { Header, PostContent } from './header';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const postId = (await params).id;
  const post = await getPost({ postId });
  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  return (
    <div className="text-md font-menlo prose prose-neutral dark:prose-invert max-w-none">
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
