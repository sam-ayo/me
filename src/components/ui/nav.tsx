'use client';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NavItem = ({ text, href }: { text: string; href?: string }) => {
  return (
    <Link href={href ? href : `/${text}`}>
      <p className="text-md cursor-pointer hover:opacity-75 hover:underline font-jetbrains-mono">
        {text}
      </p>
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

const Socials = () => {
  return (
    <div className="flex flex-col items-center gap-3">
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
  'https://3pqedghyxg.ufs.sh/f/bA3D3iOdGEoyWKAa8Lyd2z8Edin6TqtMFZyQLwOxobNpXPVf';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full flex flex-col bg-background backdrop-blur-md text-primary z-[9999] border-b mb-4">
      <div className="flex justify-between items-center py-4 md:px-0">
        <Logo />

        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex gap-8">
          <div className="flex items-end gap-8">
            <NavItem text="about" />
            <NavItem text="projects" />
            <NavItem text="resume" href={RESUME_URL} />
          </div>
          <Socials />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between py-2 border-t">
          <NavItem text="about" />
          <NavItem text="projects" />
          <NavItem text="resume" href={RESUME_URL} />
          <Socials />
        </div>
      </div>
    </nav>
  );
};

export { Nav };
