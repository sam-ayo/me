import { getPostPreview } from '@/app/get-posts';
import { WritingsList } from '@/components/ui/post-preview';
import { MobileTabContainer } from './mobile-tab-container';
import AboutContent from './about-content.mdx';
import ProjectsList from './projects-content';

export async function MobileTabContent() {
  const allPosts = await getPostPreview();

  return (
    <MobileTabContainer
      aboutContent={<AboutContent />}
      projectsContent={<ProjectsList />}
      writingsContent={<WritingsList allPosts={allPosts} />}
    />
  );
}
