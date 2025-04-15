'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

interface ScrollSpyProps {
  className?: string;
  contentSelector?: string; // Selector for the content to spy on
  headingSelector?: string; // Selector for headings to include in TOC
}

export const ScrollSpy = ({
  className,
  contentSelector = 'article', // Default to watching an article element
  headingSelector = 'h1, h2, h3', // Default to these heading levels
}: ScrollSpyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    [],
  );
  const ref = useRef<HTMLDivElement>(null);

  // Build table of contents from headings in the content
  useEffect(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const headings = Array.from(content.querySelectorAll(headingSelector));

    const toc: TableOfContentsItem[] = [];

    headings.forEach((heading) => {
      const id =
        heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;

      // If heading doesn't have an id, add one
      if (!heading.id) {
        heading.id = id;
      }

      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';

      toc.push({
        id,
        text,
        level,
      });
    });

    setTableOfContents(toc);
  }, [contentSelector, headingSelector]);

  // Implement the scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const content = document.querySelector(contentSelector);
      if (!content) return;

      const headings = Array.from(content.querySelectorAll(headingSelector));

      // Find the heading that is currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();

        if (rect.top <= 150) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentSelector, headingSelector]);

  // Close the TOC when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Menu Button */}
      <button
        aria-label="Table of Contents"
        className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-12 h-36 rounded-md bg-muted hover:bg-muted/80 transition-all duration-200"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="w-6 h-0.5 bg-foreground/60 my-1 rounded-full"
            />
          ))}
      </button>

      {/* Table of Contents Popup */}
      <div
        className={cn(
          'fixed left-20 top-1/2 -translate-y-1/2 p-6 rounded-lg bg-card border shadow-lg w-72 max-h-[80vh] overflow-y-auto',
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-4 pointer-events-none',
        )}
        onMouseLeave={() => setIsOpen(false)}
      >
        <h3 className="text-xl font-semibold mb-4">Table of Contents</h3>
        <nav>
          <ul className="space-y-2">
            {tableOfContents.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'transition-all',
                  item.level === 1 ? '' : 'ml-4',
                  item.level === 3 ? 'ml-8' : '',
                )}
              >
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'block py-1 hover:text-primary transition-colors',
                    activeId === item.id
                      ? 'text-primary font-medium'
                      : 'text-foreground/80',
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setIsOpen(false);
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
