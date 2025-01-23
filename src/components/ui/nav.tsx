"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

// ... existing imports ...

const Theme = () => {
 const { theme, setTheme } = useTheme();
 const changeTheme = () => {
  const newTheme = theme == "light" ? "dark" : "light";
  setTheme(newTheme);
 };
 return (
  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
   {theme === "light" ? (
    <Sun onClick={() => changeTheme()} className="w-5 h-5" />
   ) : (
    <Moon onClick={() => changeTheme()} className="w-5 h-5" />
   )}
  </div>
 );
};

const About = () => {
 return (
  <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
   about
  </p>
 );
};

const Projects = () => {
 return (
  <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
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
    width={24}
    height={24}
    className="hover:opacity-75 transition-opacity"
   />
  </a>
 );
};

const Socials = () => {
 return (
  <div className="flex items-center gap-4">
   <p className="text-sm text-gray-500 dark:text-gray-400">{"follow me :))"}</p>
   <div className="flex gap-3">
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
  <nav className="flex items-center justify-between p-4 border-b dark:border-gray-800">
   <div className="flex items-center gap-4">
    <Theme />
    <About />
    <Projects />
   </div>
   <Socials />
  </nav>
 );
};

// ... existing export ...
export { Nav };
