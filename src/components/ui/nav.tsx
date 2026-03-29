'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useMobileTab, TabName } from '@/components/mobile-tab-context';

const NavItem = ({
  text,
  href,
  isActive,
  onRef,
  onClick,
}: {
  text: string;
  href?: string;
  isActive?: boolean;
  onRef?: (el: HTMLElement | null) => void;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const isExternal = href?.startsWith('http');
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    onRef?.(textRef.current);
  }, [onRef]);

  return (
    <Link
      href={href ? href : `/${text}`}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="relative px-3 py-2 -mx-3 -my-2 md:p-0 md:m-0"
      onClick={onClick}
    >
      <p
        ref={textRef}
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
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeItemRef: HTMLElement | null;
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
  }, [activeItemRef, containerRef]);

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

const TAB_MAP: Record<string, TabName> = {
  about: 'about',
  projects: 'projects',
  writings: 'writings',
};

type NavItems = {
  text: string;
  href?: string;
  isActive: boolean;
}[];

const NavMenu = ({
  items,
  className,
  onTabClick,
}: {
  items: NavItems;
  className?: string;
  onTabClick?: (tab: TabName) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
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
          onClick={
            onTabClick && TAB_MAP[item.text]
              ? (e) => {
                  e.preventDefault();
                  onTabClick(TAB_MAP[item.text]);
                }
              : undefined
          }
        />
      ))}
      {activeKey && (
        <NavUnderline
          containerRef={containerRef}
          activeItemRef={activeEl}
        />
      )}
    </div>
  );
};

const Nav = () => {
  const pathname = usePathname();
  const { activeTab, setActiveTab, isTabRoute } = useMobileTab();

  // Desktop items use pathname-based active detection
  const desktopItems: NavItems = [
    { text: 'about', href: '/', isActive: pathname === '/' },
    { text: 'projects', isActive: pathname.startsWith('/projects') },
    { text: 'writings', isActive: isWritingsActive(pathname) },
    { text: 'resume', href: RESUME_URL, isActive: false },
  ];

  // Mobile items use tab context for active state when on a tab route
  const mobileItems: NavItems = isTabRoute
    ? [
        { text: 'about', href: '/', isActive: activeTab === 'about' },
        { text: 'projects', isActive: activeTab === 'projects' },
        { text: 'writings', isActive: activeTab === 'writings' },
        { text: 'resume', href: RESUME_URL, isActive: false },
      ]
    : desktopItems;

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
          <NavMenu items={desktopItems} className="items-end gap-8" />
          <Socials />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="py-4 border-t">
          <NavMenu
            items={mobileItems}
            className="items-center justify-between w-full"
            onTabClick={isTabRoute ? setActiveTab : undefined}
          />
        </div>
      </div>
    </nav>
  );
};

export { Nav };
