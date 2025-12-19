import { YearPreviews } from '@/components/ui/post-preview';
import { YearPosts } from './(post)/Post';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);

  if (!res.ok) {
    return <div>Failed to get post</div>;
  }

  const allPosts = (await res.json()) as YearPosts[];
  return (
    <>
      {allPosts.map((yearPreview, index) => {
        return (
          <YearPreviews
            key={index}
            yearPreviews={yearPreview}
            isCurrentYear={index === 0}
          />
        );
      })}
    </>
  );
}

export const dynamic = 'force-dynamic';
