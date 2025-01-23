"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

const Theme = () => {
 const { theme, setTheme } = useTheme();
 const changeTheme = () => {
  const newTheme = theme == "light" ? "dark" : "light";
  setTheme(newTheme);
 };
 return (
  <div onClick={changeTheme} className="cursor-pointer">
   {theme === "light" ? (
    <Sun className="w-5 h-5" />
   ) : (
    <Moon className="w-5 h-5" />
   )}
  </div>
 );
};

const About = () => {
 return (
  <p className="text-sm cursor-pointer hover:opacity-75">
   about
  </p>
 );
};

const Projects = () => {
 return (
  <p className="text-sm cursor-pointer hover:opacity-75">
   projects
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
 return (
  <a href={link} target="_blank">
   <Image
    src={src}
    alt={alt}
    width={20}
    height={20}
    className="hover:opacity-75 transition-opacity"
   />
  </a>
 );
};

const Logo = () => {
   return (
    <Image 
    src='Logo.svg'
    alt='logo'
    width={200}
    height={200}
    />
   ) 
}

const Socials = () => {
 return (
  <div className="flex flex-col items-center gap-3">
   <p className="text-sm text-gray-500 dark:text-gray-400">follow me :)</p>
   <div className="flex gap-2">
    <SocialIcon
     src="GitHub.svg"
     alt="github.com"
     link="https://github.com/sam-ayo"
    />
    <SocialIcon src="X.svg" alt="x.com" link="https://x.com" />
    <SocialIcon
     src="LinkedIn Circled.svg"
     alt="linkedin.com"
     link="https://www.linkedin.com/in/sam-ayo-adeoye/"
    />
   </div>
  </div>
 );
};

const Nav = () => {
 return (
  <nav className="flex items-center justify-between px-4 py-2 bg-gray-950 text-white">
  <Logo/>
   <div className="flex items-center gap-4">
    <Theme />
    <About />
    <Projects />
   </div>
   <Socials />
  </nav>
 );
};
export { Nav };
