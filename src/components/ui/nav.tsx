'use client';
import { LayoutGroup, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

const NavItem = ({
  text,
  href,
  isActive,
  groupId,
}: {
  text: string;
  href?: string;
  isActive?: boolean;
  groupId: string;
}) => {
  const isExternal = href?.startsWith('http');
  const underlineRef = useRef<HTMLDivElement>(null);

  return (
    <Link
      href={href ? href : `/${text}`}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="relative"
    >
      <p
        className={`text-sm md:text-base cursor-pointer hover:opacity-75 font-jetbrains-mono ${
          isActive ? 'font-bold' : ''
        }`}
      >
        {text}
        {isExternal && <span className="inline-block ml-1 text-xl">↗</span>}
      </p>
      {isActive && (
        <motion.div
          ref={underlineRef}
          layoutId={`nav-underline-${groupId}`}
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-current"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  );
};

const SocialIcon = ({
  src,
  alt,
  link,
}: {
  src: string;
  alt: string;
  link: string;
}) => {
  return (
    <a href={link} target="_blank">
      <Image
        src={src}
        alt={alt}
        width="0"
        height="0"
        className={`w-8 h-6 hover:opacity-75 transition-opacity`}
      />
    </a>
  );
};

const Logo = () => {
  return (
    <Link className={`self-end`} href="/">
      <Image
        src="Logo-In-Darkmode.svg"
        alt="logo"
        width="0"
        height="0"
        priority
        className="w-48 h-auto"
      />
    </Link>
  );
};

const Socials = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${compact ? '' : 'flex-col'}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">follow mee :))</p>
      <div className="flex gap-2">
        <SocialIcon
          src="GitHub-In-Darkmode.svg"
          alt="github.com"
          link="https://github.com/sam-ayo"
        />
        <SocialIcon
          src="X-In-Darkmode.svg"
          alt="x.com"
          link="https://x.com/sam_ayo__"
        />
        <SocialIcon
          src="LinkedIn-In-Darkmode.svg"
          alt="linkedin.com"
          link="https://www.linkedin.com/in/sam-ayo-adeoye/"
        />
      </div>
    </div>
  );
};

const RESUME_URL =
  'https://3pqedghyxg.ufs.sh/f/bA3D3iOdGEoyKuzlxOYSiap4z0oTCPkRyGUmIeZXrlbvLfVY';

const isWritingsActive = (pathname: string) => {
  if (pathname.startsWith('/writings')) return true;
  // Post pages are at /<year>/... (e.g. /2024/some-post)
  return /^\/\d{4}\//.test(pathname);
};

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full flex flex-col text-primary border-b">
      <div className="flex justify-between items-center py-4 md:px-0">
        <Logo />

        {/* Socials beside logo on mobile */}
        <div className="md:hidden">
          <Socials compact />
        </div>

{/* Desktop menu */}
        <div className="hidden md:flex gap-8">
          <LayoutGroup id="desktop-nav">
            <div className="flex items-end gap-8">
              <NavItem
                text="about"
                href="/"
                isActive={pathname === '/'}
                groupId="desktop"
              />
              <NavItem
                text="projects"
                isActive={pathname.startsWith('/projects')}
                groupId="desktop"
              />
              <NavItem
                text="writings"
                isActive={isWritingsActive(pathname)}
                groupId="desktop"
              />
              <NavItem text="resume" href={RESUME_URL} groupId="desktop" />
            </div>
          </LayoutGroup>
          <Socials />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="py-4 border-t">
          <LayoutGroup id="mobile-nav">
            <div className="flex items-center justify-between w-full">
              <NavItem
                text="about"
                href="/"
                isActive={pathname === '/'}
                groupId="mobile"
              />
              <NavItem
                text="projects"
                isActive={pathname.startsWith('/projects')}
                groupId="mobile"
              />
              <NavItem
                text="writings"
                isActive={isWritingsActive(pathname)}
                groupId="mobile"
              />
              <NavItem text="resume" href={RESUME_URL} groupId="mobile" />
            </div>
          </LayoutGroup>
        </div>
      </div>
    </nav>
  );
};

export { Nav };
