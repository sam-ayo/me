import { MobileTabContainer } from './mobile-tab-container';
import AboutContent from './about-content.mdx';
import ProjectsList from './projects-content';
import ResumeContent from './resume-content';

// The about tab reads as body text, so its paragraphs are larger than the
// paragraphs of a blog post.
export const AboutParagraph = (props: React.ComponentProps<'p'>) => (
  <p className="my-10 text-base/7 first:mt-4 md:first:mt-10" {...props} />
);

export function MobileTabContent() {
  return (
    <MobileTabContainer
      aboutContent={
        <div className="enter-stagger">
          <AboutContent components={{ p: AboutParagraph }} />
        </div>
      }
      projectsContent={<ProjectsList />}
      resumeContent={<ResumeContent />}
    />
  );
}
