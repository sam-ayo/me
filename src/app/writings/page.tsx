import { WritingsList } from '@/components/ui/post-preview';
import { getPostPreview } from '@/app/get-posts';

export default async function Writings() {
  const allPosts = await getPostPreview();

  return <WritingsList allPosts={allPosts} />;
}
