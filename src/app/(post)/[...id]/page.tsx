import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { tags } from './html-tag-styles';
import { Header, PostContent } from './header';
import { ScrollSpy } from '@/components/scroll-spy';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const postId = (await params).id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?postId=${postId.join('/')}`,
  );

  if (!res.ok) {
    return <div>Could not get post</div>;
  }
  const post = (await res.json()) as PostContent;
  post.date = new Date(post.date);

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  return (
    <div className="relative">
      <ScrollSpy contentSelector=".post-content" headingSelector="h1, h2, h3" />

      <article className="text-md font-menlo prose prose-neutral dark:prose-invert max-w-none post-content">
        <Header post={post as PostContent} />
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{ ...tags }}
        >
          {post.content}
        </Markdown>
      </article>
    </div>
  );
}
