import { allPosts } from 'content-collections';
import { YearPosts } from './(post)/Post';
import { cacheClient } from '../../redis';

const getPostPreview = async () => {
  const postsByYear = allPosts.reduce(
    (acc, p) => {
      const year = p.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(p);
      return acc;
    },
    {} as Record<string, typeof allPosts>,
  );

  const posts: YearPosts[] = Object.entries(postsByYear).map(
    ([year, yearPosts]) => ({
      year: parseInt(year),
      posts: yearPosts
        .map((p) => ({
          title: p.title,
          id: p.id,
          tags: p.tags,
          date: p.date,
          views: 0,
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    }),
  );

  return posts.sort((a, b) => b.year - a.year);
};

const getPostViews = async () => {
  const postIds = allPosts.map((p) => p.id);
  if (postIds.length === 0) return {};
  const viewResponses = await cacheClient.mget<(number | null)[]>(...postIds);
  return Object.fromEntries(
    postIds.map((id, index) => [id, viewResponses[index] ?? 0]),
  );
};

const getPost = async ({ postId }: { postId: string }) => {
  const post = allPosts.find((p) => p.id === postId);

  if (!post) {
    throw new Error('Post not found');
  }

  const views = ((await cacheClient.get(post.id)) as number) ?? 0;

  return {
    ...post,
    views,
  };
};

export { getPostPreview, getPostViews, getPost };
