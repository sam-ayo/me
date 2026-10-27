import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Download, Github } from 'lucide-react';
import releases from '@/data/releases.json';
import { MacDownloadLink } from '@/components/mac-download-link';
import { getColimaGuiRelease } from '@/lib/colima-gui-release';
import ScreenshotGallery, {
  type Screenshot,
} from '@/components/screenshot-gallery';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  github?: string;
  // `detectMacArch` picks the Apple silicon or Intel installer on click.
  download?: { url: string; label: string; detectMacArch?: boolean };
  screenshots?: Screenshot[];
}

const projects: Project[] = [
  {
    id: 'mail',
    title: 'Mail',
    description:
      'A keyboard-first email client with one inbox for all your accounts.',
    tags: ['TypeScript', 'React Router', 'PostgreSQL', 'Tailwind CSS'],
    href: 'https://mail.samayo.me',
    github: 'https://github.com/sam-ayo/mail',
    screenshots: [
      {
        src: '/projects/mail/inbox.jpg',
        alt: 'The unified inbox with an open conversation',
      },
      {
        src: '/projects/mail/palette.jpg',
        alt: 'The command palette',
      },
      {
        src: '/projects/mail/light.jpg',
        alt: 'The inbox in the light theme',
      },
    ],
  },
  {
    id: 'colima-gui',
    title: 'Colima GUI',
    description:
      'Manage Colima and your Docker containers from a native macOS app.',
    tags: ['Rust', 'GPUI', 'Docker', 'macOS'],
    href: 'https://github.com/sam-ayo/colima-gui-releases/releases/latest',
    download: {
      url: '/download/colima-gui',
      label: 'macOS',
      detectMacArch: true,
    },
  },
  {
    id: 'clonetray',
    title: 'CloneTray',
    description:
      'Clone Git repos from the macOS menu bar, straight into your editor.',
    tags: ['Swift', 'AppKit', 'macOS', 'Homebrew'],
    href: 'https://github.com/sam-ayo/clonetray',
    github: 'https://github.com/sam-ayo/clonetray',
    download: {
      url: releases.clonetray.download,
      label: `v${releases.clonetray.version}`,
    },
  },
  {
    id: 'notable',
    title: 'Notable',
    description: 'Recording tool with transcription and chat.',
    tags: [
      'TypeScript',
      'Dart',
      'PostgreSQL',
      'Vercel AI SDK',
      'React',
      'Electron',
      'Flutter',
    ],
    href: 'https://www.notableai.ca',
  },
  {
    id: 'regpo',
    title: 'Regpo',
    description: 'Get notified when a university course seat opens up.',
    tags: ['Rust', 'TypeScript'],
    href: 'https://github.com/sam-ayo/regpo',
    github: 'https://github.com/sam-ayo/regpo',
  },
  {
    id: 'bud',
    title: 'Bud',
    description: 'Turn free text workout notes into structured exercise logs.',
    tags: ['TypeScript', 'Dart', 'PostgreSQL', 'Vercel AI SDK', 'Flutter'],
    href: 'https://bud-landing.vercel.app',
  },
  {
    id: 'rechef',
    title: 'Rechef',
    description: 'Extract recipes from URLs, videos, and photos using AI.',
    tags: ['TypeScript', 'Dart', 'PostgreSQL', 'Flutter'],
    href: 'https://apps.apple.com/us/app/rechef-recipe-manager/id6758213347',
  },
  {
    id: 'ragask',
    title: 'Ragask',
    description: 'AI copilot for literature reviews using RAG.',
    tags: [
      'Python',
      'LangChain',
      'FastAPI',
      'OpenAI',
      'Next.js',
      'React',
      'TypeScript',
      'MongoDB',
    ],
    href: 'https://app.ragask.com',
    github: 'https://github.com/sam-ayo/ragask',
  },
];

// The padding and negative margin give each icon a bigger touch area with no
// change to the layout. `relative` lifts the icon above the row link.
const iconLinkClass =
  'relative -m-1.5 flex items-center gap-1 p-1.5 text-secondary transition-[color,transform] duration-150 ease-out hover:text-primary active:scale-[0.97]';

const ProjectPreview = ({ project }: { project: Project }) => {
  return (
    <div className="group relative rounded-lg transition-[background-color,transform] duration-150 ease-out hover:bg-badge-background/70 active:scale-[0.99]">
      <div className="px-2 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-4">
            {/* The link covers the whole row, so a tap anywhere opens it. */}
            <Link
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold after:absolute after:inset-0 after:rounded-lg"
            >
              {project.title}
            </Link>
            <div className="flex items-center gap-3 shrink-0">
              {project.download?.detectMacArch && (
                <MacDownloadLink
                  href={project.download.url}
                  className={iconLinkClass}
                >
                  <Download size={16} />
                  <span className="font-plex-mono text-[10px]">
                    {project.download.label}
                  </span>
                </MacDownloadLink>
              )}
              {project.download && !project.download.detectMacArch && (
                <Link
                  href={project.download.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={iconLinkClass}
                >
                  <Download size={16} />
                  <span className="font-plex-mono text-[10px]">
                    {project.download.label}
                  </span>
                </Link>
              )}
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className={iconLinkClass}
                >
                  <Github size={18} />
                </Link>
              )}
            </div>
          </div>
          <p className="text-base/7 text-secondary">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, index) => (
              <Badge
                className="font-plex-mono whitespace-nowrap text-[10px] px-1.5 py-0"
                key={index}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {project.screenshots && (
            <ScreenshotGallery
              title={project.title}
              screenshots={project.screenshots}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default async function ProjectsList() {
  const colimaGui = await getColimaGuiRelease();
  const list = projects.map((project) =>
    project.id === 'colima-gui' && project.download && colimaGui
      ? {
          ...project,
          download: { ...project.download, label: `v${colimaGui.version}` },
        }
      : project,
  );

  return (
    <div className="flex flex-col gap-4 mt-4 md:mt-8">
      <div className="enter-stagger flex flex-col gap-1">
        {list.map((project) => (
          <ProjectPreview key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
