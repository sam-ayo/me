import { allPosts } from "content-collections";
import { PostPreview, YearPosts } from "./(post)/Post";

const getPostPreview = () => {
  const posts: YearPosts[] = [];
  allPosts.forEach((p) => {
    const yearPost = posts.find((post) => post.year == parseInt(p.year));

    const post: PostPreview = {
      title: p.title,
      id: p.id,
      tags: p.tags,
      date: p.date,
      views: 1222,
    };

    if (!yearPost) {
      posts.push({
        year: parseInt(p.year, 10),
        posts: [post],
      });
    } else {
      yearPost.posts.push(post);
    }
  });
  posts.sort((a, b) => b.year - a.year);
  return posts;
};

const getPost = ({ postId }: { postId: string[] }) => {
  const post = allPosts.find((p) => {
    return p.id.replace("/", "") === postId.join("");
  });
  return post;
};

export { getPostPreview, getPost };
