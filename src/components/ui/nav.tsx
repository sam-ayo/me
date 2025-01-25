"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Theme = () => {
 const { theme, setTheme } = useTheme();
 const changeTheme = () => {
  const newTheme = theme == "light" ? "dark" : "light";
  setTheme(newTheme);
 };
 return (
  <div onClick={changeTheme} className="cursor-pointer hover:opacity-75">
   {theme === "light" ? (
    <Sun className="w-5 h-5" />
   ) : (
    <Moon className="w-5 h-5" />
   )}
  </div>
 );
};

const NavItem = ({text}:{text: string}) => {
 return (
  <p className="text-md cursor-pointer hover:opacity-75 hover:underline font-jetbrains-mono">
   {text}
  </p>
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
 const { theme } = useTheme();
 return (
  <a href={link} target="_blank">
   <Image
    src={src}
    alt={alt}
    width={24}
    height={24}
    className={`hover:opacity-75 transition-opacity ${
      theme === 'light' ? 'invert' : ''
    }`}
   />
  </a>
 );
};

const Logo = () => {
 const { theme } = useTheme();
   return (
     <Link
    className={`self-end ${
      theme === 'light' ? 'invert' : ''
    }`}
     href="/">
    <Image 
    src='Logo-In-Darkmode.svg'
    alt='logo'
    width={200}
    height={200}
    />
     </Link>
   ) 
}

const Socials = () => {
  const {theme} = useTheme()
 return (
  <div className="flex flex-col items-center gap-3">
   <p className="text-sm text-gray-500 dark:text-gray-400">follow mee :))</p>
   <div className="flex gap-2">
   {theme === 'light' ? 
    <SocialIcon
     src="GitHub-In-Lightmode.svg"
     alt="github.com"
     link="https://github.com/sam-ayo"
    />
: 
    <SocialIcon
     src="GitHub-In-Darkmode.svg"
     alt="github.com"
     link="https://github.com/sam-ayo"
    />
}
    <SocialIcon src="X-In-Darkmode.svg" alt="x.com" link="https://x.com" />
    <SocialIcon
     src="LinkedIn-In-Darkmode.svg"
     alt="linkedin.com"
     link="https://www.linkedin.com/in/sam-ayo-adeoye/"
    />
   </div>
  </div>
 );
};

const Nav = () => {
 return (
  <nav className="sticky top-0 w-full flex item-end justify-between py-4 bg-background backdrop-blur-md text-primary z-[9999] border-b">
   <Logo/>
   <div className="flex gap-8">
   <div className="flex items-end gap-8">
    <Theme />
    <NavItem text="about" />
    <NavItem text="projects" />
   </div>
   <Socials />
   </div>
  </nav>
 );
};
export { Nav };
