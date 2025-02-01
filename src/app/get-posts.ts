import { allPosts } from 'content-collections';
import { YearPosts } from './(post)/Post';
import axios from 'axios';

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

  let viewsById: { [key: string]: number } = {};

  if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
    const viewPromises = allPosts.map((p) =>
      axios.get(`${process.env.BASE_URL}/api/views`, {
        params: { postId: p.id },
      }),
    );

    const viewResponses = await Promise.all(viewPromises);
    viewsById = Object.fromEntries(
      viewResponses.map((response, index) => [
        allPosts[index].id,
        response.data.noOfViews,
      ]),
    );
  }

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

const getPost = async ({ postId }: { postId: string[] }) => {
  const post = allPosts.find((p) => p.id === postId.join('/'));

  if (!post) {
    throw new Error('Post not found');
  }

  let views = 0;
  try {
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window !== 'undefined'
    ) {
      const response = await axios.get(`${process.env.BASE_URL}/api/views`, {
        params: { postId: post.id },
      });
      views = response.data.noOfViews ?? 0;
    }
  } catch (error) {
    console.warn('Failed to fetch view count:', error);
  }

  return {
    ...post,
    views,
  };
};

export { getPostPreview, getPost };
