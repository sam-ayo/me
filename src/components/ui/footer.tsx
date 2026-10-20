import { ThemeSwitcher } from './theme-switcher';

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={`${className} flex justify-between text-xs`}>
      <div>Copyright &#169; {new Date().getFullYear()} Samuel Adeoye</div>
      <div className="flex gap-4">
        <ThemeSwitcher />
        <a
          target="_blank"
          href="https://github.com/sam-ayo/me"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Source
        </a>
      </div>
    </footer>
  );
};

export { Footer };
