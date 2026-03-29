'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';

const NavItem = ({
  text,
  href,
  isActive,
  onRef,
}: {
  text: string;
  href?: string;
  isActive?: boolean;
  onRef?: (el: HTMLAnchorElement | null) => void;
}) => {
  const isExternal = href?.startsWith('http');
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    onRef?.(linkRef.current);
  }, [onRef]);

  return (
    <Link
      ref={linkRef}
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
    </Link>
  );
};

// Single underline component that measures active item position relative to container
const NavUnderline = ({
  containerRef,
  activeItemRef,
  activeKey,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeItemRef: HTMLAnchorElement | null;
  activeKey: string;
}) => {
  const [pos, setPos] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    if (!activeItemRef || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = activeItemRef.getBoundingClientRect();
    const newPos = {
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
    };
    setPos(newPos);
  }, [activeItemRef, containerRef, activeKey]);

  useEffect(() => {
    measure();
  }, [measure]);

  // Re-measure on resize
  useEffect(() => {
    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measure]);

  if (!pos) return null;

  return (
    <motion.div
      className="absolute -bottom-1 h-0.5 bg-current"
      animate={{ left: pos.left, width: pos.width }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    />
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

type NavItems = {
  text: string;
  href?: string;
  isActive: boolean;
}[];

const NavMenu = ({
  items,
  className,
}: {
  items: NavItems;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [, forceUpdate] = useState(0);

  const activeItem = items.find((i) => i.isActive);
  const activeKey = activeItem?.text ?? '';
  const activeEl = itemRefs.current[activeKey] ?? null;

  // Force re-render after refs are set on first mount
  useEffect(() => {
    forceUpdate((n) => n + 1);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex ${className ?? ''}`}>
      {items.map((item) => (
        <NavItem
          key={item.text}
          text={item.text}
          href={item.href}
          isActive={item.isActive}
          onRef={(el) => {
            itemRefs.current[item.text] = el;
          }}
        />
      ))}
      {activeKey && (
        <NavUnderline
          containerRef={containerRef}
          activeItemRef={activeEl}
          activeKey={activeKey}
        />
      )}
    </div>
  );
};

const Nav = () => {
  const pathname = usePathname();

  const items: NavItems = [
    { text: 'about', href: '/', isActive: pathname === '/' },
    { text: 'projects', isActive: pathname.startsWith('/projects') },
    { text: 'writings', isActive: isWritingsActive(pathname) },
    { text: 'resume', href: RESUME_URL, isActive: false },
  ];

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
          <NavMenu items={items} className="items-end gap-8" />
          <Socials />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="py-4 border-t">
          <NavMenu
            items={items}
            className="items-center justify-between w-full"
          />
        </div>
      </div>
    </nav>
  );
};

export { Nav };
