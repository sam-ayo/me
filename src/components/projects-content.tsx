import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Download, Github } from 'lucide-react';
import releases from '@/data/releases.json';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  github?: string;
  download?: { url: string; label: string };
}

const projects: Project[] = [
  {
    id: 'rechef',
    title: 'Rechef',
    description: 'Extract recipes from URLs, videos, and photos using AI.',
    tags: ['TypeScript', 'Dart', 'PostgreSQL', 'Flutter'],
    href: 'https://apps.apple.com/us/app/rechef-recipe-manager/id6758213347',
  },
  {
    id: 'notable-ai',
    title: 'Notable AI',
    description:
      'AI meeting assistant with recording, transcription, and chat.',
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
    id: 'clonetray',
    title: 'CloneTray',
    description:
      'Clone Git repos from the macOS menu bar, straight into your editor.',
    tags: ['Swift', 'AppKit', 'macOS', 'Homebrew'],
    href: releases.clonetray.download,
    github: 'https://github.com/sam-ayo/clonetray',
    download: {
      url: releases.clonetray.download,
      label: `v${releases.clonetray.version}`,
    },
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

const ProjectPreview = ({ project }: { project: Project }) => {
  return (
    <div className="group hover:bg-accent/10">
      <div className="px-2 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-4">
            <Link href={project.href} target="_blank" rel="noopener noreferrer">
              <p className="font-semibold group-hover:underline cursor-pointer">
                {project.title}
              </p>
            </Link>
            <div className="flex items-center gap-3 shrink-0">
              {project.download && (
                <Link
                  href={project.download.url}
                  className="flex items-center gap-1 text-secondary hover:text-primary"
                >
                  <Download size={16} />
                  <span className="font-jetbrains-mono text-[10px]">
                    {project.download.label}
                  </span>
                </Link>
              )}
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github
                    size={18}
                    className="text-secondary hover:text-primary"
                  />
                </Link>
              )}
            </div>
          </div>
          <p className="text-sm text-secondary">{project.description}</p>
          <div className="flex flex-nowrap gap-1.5 cursor-default overflow-x-auto">
            {project.tags.map((tag, index) => (
              <Badge
                className="font-jetbrains-mono whitespace-nowrap text-[10px] px-1.5 py-0"
                key={index}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProjectsList() {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <div key={project.id}>
            <ProjectPreview project={project} />
            {index < projects.length - 1 && (
              <div className="border-b transition-all group-hover:border-transparent" />
            )}
          </div>
        ))}
        <div className="border-b transition-all" />
      </div>
    </div>
  );
}
