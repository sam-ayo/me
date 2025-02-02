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

  const viewPromises = allPosts.map(
    (p) => cacheClient.get(p.id) as Promise<number>,
  );

  const viewResponses = await Promise.all(viewPromises);
  const viewsById = Object.fromEntries(
    viewResponses.map((response, index) => [allPosts[index].id, response ?? 0]),
  );

  const posts: YearPosts[] = Object.entries(postsByYear).map(
    ([year, yearPosts]) => ({
      year: parseInt(year),
      posts: yearPosts.map((p) => ({
        title: p.title,
        id: p.id,
        tags: p.tags,
        date: p.date,
        views: viewsById[p.id],
      })),
    }),
  );

  return posts.sort((a, b) => b.year - a.year);
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

export { getPostPreview, getPost };
