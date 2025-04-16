import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  github?: string;
}

const mockProjects: Project[] = [
  {
    id: 'ragask',
    title: 'Ragask',
    description: 'A ai powered research assistant',
    tags: [
      'FastAPI',
      'Next.js',
      'Tailwind CSS',
      'MongoDB',
      'BeanieODM',
      'TypeScript',
    ],
    href: 'https://app.ragask.com',
    github: 'https://github.com/sam-ayo/ragask',
  },
  {
    id: 'project-2',
    title: 'Innovative Project Beta',
    description: 'Solving a real-world problem with cutting-edge technology.',
    tags: ['Python', 'Flask', 'Docker', 'PostgreSQL'],
    href: '#',
    github: '#',
  },
  {
    id: 'project-3',
    title: 'Creative Project Gamma',
    description: 'An exploration of interactive design and user experience.',
    tags: ['SvelteKit', 'Three.js', 'WebSockets'],
    href: '#',
    github: '#',
  },
];

const ProjectPreview = ({ project }: { project: Project }) => {
  return (
    <div className="group hover:bg-accent/10">
      <div className="px-2 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <Link href={project.href} target="_blank" rel="noopener noreferrer">
              <p className="font-semibold group-hover:underline cursor-pointer">
                {project.title}
              </p>
            </Link>
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Github
                  size={18}
                  className="text-secondary hover:text-primary"
                />
              </Link>
            )}
          </div>
          <p className="text-sm text-secondary">{project.description}</p>
          <div className="flex flex-wrap gap-2 cursor-default mt-1">
            {project.tags.map((tag, index) => (
              <Badge
                className="font-jetbrains-mono whitespace-nowrap"
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

export default function Projects() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <div className="flex flex-col">
        <div className="border-b transition-all" />
        {mockProjects.map((project, index) => (
          <div key={project.id}>
            <ProjectPreview project={project} />
            {index < mockProjects.length - 1 && (
              <div className="border-b transition-all group-hover:border-transparent" />
            )}
          </div>
        ))}
        <div className="border-b transition-all" />
      </div>
    </div>
  );
}
