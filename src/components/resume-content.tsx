import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ResumePdfDialog from '@/components/resume-pdf-dialog';
import {
  contacts,
  education,
  experience,
  name,
  projects,
  skills,
  summary,
} from '@/lib/resume-data';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-jetbrains-mono text-xs uppercase tracking-widest text-secondary">
      {title}
    </h2>
    {children}
  </section>
);

const EntryHeader = ({
  heading,
  subheading,
  meta,
  href,
}: {
  heading: string;
  subheading?: string;
  meta: string;
  href?: string;
}) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
    <p className="font-semibold">
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {heading}
        </Link>
      ) : (
        heading
      )}
      {subheading && (
        <span className="font-normal text-secondary"> · {subheading}</span>
      )}
    </p>
    <p className="font-jetbrains-mono text-[10px] text-secondary shrink-0">
      {meta}
    </p>
  </div>
);

const Points = ({ points }: { points: string[] }) => (
  <ul className="flex flex-col gap-1.5">
    {points.map((point) => (
      <li key={point} className="flex gap-2 text-sm text-secondary">
        <span aria-hidden="true">–</span>
        <span>{point}</span>
      </li>
    ))}
  </ul>
);

export default function ResumeContent() {
  return (
    <div
      data-resume-root
      className="flex flex-col gap-8 mt-8 print:gap-6 print:mt-0"
    >
      <header className="flex flex-col gap-3">
        <h1 className="hidden print:block text-xl font-semibold">{name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {contacts
              .filter((contact) => !contact.pdfOnly)
              .map((contact) => (
                <Link
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-jetbrains-mono text-xs text-secondary hover:text-primary hover:underline"
                >
                  <span className="print:hidden">{contact.label}</span>
                  <span className="hidden print:inline">{contact.print}</span>
                </Link>
              ))}
          </div>
          <ResumePdfDialog />
        </div>
        <p className="text-sm text-secondary">{summary}</p>
      </header>

      <Section title="Experience">
        <div className="flex flex-col">
          <div className="mx-2 border-b" />
          {experience.map((role, index) => (
            <div key={`${role.company}-${role.dates}`}>
              <div className="flex flex-col gap-1.5 px-2 py-3 print:break-inside-avoid">
                <EntryHeader
                  heading={role.title}
                  subheading={role.company}
                  meta={role.dates}
                />
                <Points points={role.points} />
              </div>
              {index < experience.length - 1 && (
                <div className="mx-2 border-b" />
              )}
            </div>
          ))}
          <div className="mx-2 border-b" />
        </div>
      </Section>

      <Section title="Projects">
        <div className="flex flex-col">
          <div className="mx-2 border-b" />
          {projects.map((project, index) => (
            <div key={project.title}>
              <div className="flex flex-col gap-1.5 px-2 py-3 print:break-inside-avoid">
                <EntryHeader
                  heading={project.title}
                  meta={project.date}
                  href={project.href}
                />
                <Points points={project.points} />
                <div className="flex flex-wrap gap-1.5 cursor-default">
                  {project.stack.map((tag) => (
                    <Badge
                      key={tag}
                      className="font-jetbrains-mono whitespace-nowrap text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {index < projects.length - 1 && <div className="mx-2 border-b" />}
            </div>
          ))}
          <div className="mx-2 border-b" />
        </div>
      </Section>

      <Section title="Skills">
        <div className="flex flex-col gap-2.5 px-2">
          {skills.map((group) => (
            <div
              key={group.label}
              className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-3"
            >
              <p className="font-jetbrains-mono text-[10px] uppercase tracking-wide text-secondary sm:w-24 sm:shrink-0">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5 cursor-default">
                {group.items.map((item) => (
                  <Badge
                    key={item}
                    className="font-jetbrains-mono whitespace-nowrap text-[10px] px-1.5 py-0"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="flex flex-col">
          <div className="mx-2 border-b" />
          <div className="flex flex-col gap-1.5 px-2 py-3 print:break-inside-avoid">
            <EntryHeader heading={education.school} meta={education.dates} />
            <p className="text-sm text-secondary">{education.degree}</p>
            <p className="font-jetbrains-mono text-[10px] text-secondary">
              {education.location}
            </p>
            <Points points={education.notes} />
          </div>
          <div className="mx-2 border-b" />
        </div>
      </Section>
    </div>
  );
}
