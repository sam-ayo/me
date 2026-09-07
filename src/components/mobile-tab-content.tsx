import { MobileTabContainer } from './mobile-tab-container';
import AboutContent from './about-content.mdx';
import ProjectsList from './projects-content';
import ResumeContent from './resume-content';

export function MobileTabContent() {
  return (
    <MobileTabContainer
      aboutContent={<AboutContent />}
      projectsContent={<ProjectsList />}
      resumeContent={<ResumeContent />}
    />
  );
}
