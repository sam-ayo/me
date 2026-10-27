'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {
  useMobileTab,
  SPRING,
  TabName,
} from '@/components/mobile-tab-context';

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
        className={`text-sm md:text-base cursor-pointer transition-opacity hover:opacity-75 font-plex-mono ${
          isActive ? 'font-bold' : ''
        }`}
      >
        {text}
        {isExternal && <span className="inline-block ml-1 text-xl">↗</span>}
      </p>
    </Link>
  );
};

type Edges = { left: number; right: number };

// A click moves the bar with no finger to follow, so it can move faster than
// the strip does after a swipe.
const CLICK_SPRING = { ...SPRING, visualDuration: 0.2 };

// The clip of the underline from the edges of the item that it shows under.
const clipOf = ({ left, right }: Edges) => `inset(0 ${right}px 0 ${left}px)`;

/* The bar is as wide as the menu, and a clip shows only the part under the
   active item. A 1px bar stretched with scaleX is too long on a phone: the
   GPU stretches the pixel edge of the bar with the same scale. The clip
   changes no layout, and its edges stay sharp at each frame. */
const NavUnderline = ({
  containerRef,
  itemEls,
  activeIndex,
  position,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemEls: (HTMLElement | null)[];
  activeIndex: number;
  // The tab strip offset. Without it, the bar moves only on a tab change.
  position?: MotionValue<number>;
}) => {
  const [edges, setEdges] = useState<Edges[] | null>(null);
  const reducedMotion = useReducedMotion();

  /* Without a tab strip, the bar moves with a spring. An ease-out curve
     starts at full speed, so the bar jumped about 40% of the distance in the
     first frame. The spring starts at rest. */
  const ownPosition = useMotionValue(-activeIndex);
  useEffect(() => {
    if (position) return;
    if (reducedMotion) {
      ownPosition.jump(-activeIndex);
      return;
    }
    const controls = animate(ownPosition, -activeIndex, CLICK_SPRING);
    return () => controls.stop();
  }, [position, ownPosition, activeIndex, reducedMotion]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || itemEls.some((el) => !el)) return;
    const containerRect = container.getBoundingClientRect();
    setEdges(
      itemEls.map((el) => {
        const itemRect = el!.getBoundingClientRect();
        return {
          left: itemRect.left - containerRect.left,
          right: containerRect.right - itemRect.right,
        };
      }),
    );
  }, [itemEls, containerRef]);

  useEffect(() => {
    measure();
  }, [measure]);

  // The web font and the window can both change the item width.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    itemEls.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [measure, containerRef, itemEls]);

  /* During a swipe the bar goes between the two items in the same ratio as
     the strip goes between the two panels. Past an edge, the bar stays on
     the edge item. */
  const clip = useTransform(position ?? ownPosition, (p) => {
    if (!edges) return 'inset(0 100% 0 0)';
    const at = Math.min(Math.max(-p, 0), edges.length - 1);
    const from = edges[Math.floor(at)];
    const to = edges[Math.ceil(at)];
    const t = at - Math.floor(at);
    return clipOf({
      left: from.left + (to.left - from.left) * t,
      right: from.right + (to.right - from.right) * t,
    });
  });

  if (!edges || !edges[activeIndex]) return null;

  return (
    <motion.div
      className="enter-fade absolute -bottom-1 inset-x-0 h-0.5 bg-current"
      style={{ clipPath: clip }}
    />
  );
};

/* The glyphs are inline, so they take the text color and need no image
   request. GitHub and LinkedIn fill a circle, but X is a bare glyph that
   looks larger at the same size, so it gets a smaller box. */
const SOCIALS = [
  {
    label: 'github.com',
    href: 'https://github.com/sam-ayo',
    viewBox: '0 0 17 16',
    iconClass: 'size-5',
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 0C3.806 0 0 3.668 0 8.192c0 3.62 2.436 6.69 5.813 7.774.425.075.58-.178.58-.395 0-.195-.007-.84-.01-1.525-2.366.496-2.865-.966-2.865-.966-.386-.947-.943-1.199-.943-1.199-.772-.508.058-.498.058-.498.853.058 1.303.844 1.303.844.758 1.253 1.988.89 2.473.681.077-.53.297-.89.54-1.095-1.888-.207-3.873-.91-3.873-4.049 0-.894.332-1.625.876-2.199-.088-.206-.38-1.04.083-2.168 0 0 .714-.22 2.339.84A8.435 8.435 0 018.5 4.104c.723.004 1.45.094 2.13.276 1.623-1.06 2.337-.84 2.337-.84.464 1.129.172 1.962.084 2.168.545.574.875 1.305.875 2.199 0 3.147-1.987 3.839-3.88 4.041.305.254.577.753.577 1.517 0 1.096-.01 1.979-.01 2.248 0 .218.153.474.584.393C14.568 14.88 17 11.81 17 8.192 17 3.668 13.194 0 8.5 0z"
      />
    ),
  },
  {
    label: 'x.com',
    href: 'https://x.com/sam_ayo__',
    viewBox: '0 0 15 14',
    iconClass: 'size-4',
    path: (
      <path d="M11.807 0H14.041L9.103 5.52L14.86 13.104H10.435L6.903 8.374L2.873 13.104H0.638L5.903 7.198L0.36 0H4.898L8.075 4.327L11.807 0ZM11.062 11.776H12.327L4.205 1.254H2.856L11.062 11.776Z" />
    ),
  },
  {
    label: 'linkedin.com',
    href: 'https://www.linkedin.com/in/sam--ayo',
    viewBox: '0 0 17 17',
    iconClass: 'size-5',
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 0C3.813 0 0 3.813 0 8.5C0 13.187 3.813 17 8.5 17C13.187 17 17 13.187 17 8.5C17 3.813 13.187 0 8.5 0ZM12.723 12.787H10.946V10.002C10.946 9.338 10.933 8.484 10.02 8.484C9.094 8.484 8.952 9.206 8.952 9.953V12.787H7.175V7.061H8.882V7.841H8.905C9.143 7.391 9.724 6.916 10.59 6.916C12.39 6.916 12.724 8.101 12.724 9.644V12.787ZM5.168 6.277C4.596 6.277 4.136 5.814 4.136 5.245C4.136 4.676 4.597 4.213 5.168 4.213C5.738 4.213 6.2 4.676 6.2 5.245C6.2 5.814 5.738 6.277 5.168 6.277ZM6.059 12.787H4.277V7.061H6.059V12.787Z"
      />
    ),
  },
];

const SocialIcon = ({ social }: { social: (typeof SOCIALS)[number] }) => {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className="-m-1.5 flex size-8 items-center justify-center transition-[opacity,transform] duration-150 ease-out hover:opacity-75 active:scale-[0.97]"
    >
      <svg
        viewBox={social.viewBox}
        fill="currentColor"
        aria-hidden="true"
        className={social.iconClass}
      >
        {social.path}
      </svg>
    </a>
  );
};

/* The SVG has a fixed fill, so it is a mask over the text color. Then the
   logo follows the color mode. The aspect ratio comes from the SVG viewBox.
   The baseline of the logo text is 5px above the bottom of the SVG, and the
   link underline is 2px below the links. On desktop the logo moves down 7px,
   so its text sits on the underline. */
const Logo = () => {
  return (
    <Link className="self-end md:translate-y-[7px]" href="/">
      <span
        role="img"
        aria-label="logo"
        className="block w-48 aspect-[143/19] bg-current [mask:url(/Logo-In-Darkmode.svg)_center/contain_no-repeat]"
      />
    </Link>
  );
};

// The icon row has the line height of the nav links, so the icons sit on the
// same line as the links. On desktop the label floats above the icons, so it
// does not move the row.
const Socials = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div
      className={
        compact ? 'flex flex-col items-end gap-1' : 'relative flex items-end'
      }
    >
      <p
        className={`text-xs whitespace-nowrap text-secondary md:text-sm ${
          compact ? '' : 'absolute bottom-full right-0 mb-2'
        }`}
      >
        follow mee :))
      </p>
      <div className="flex h-6 items-center gap-3">
        {SOCIALS.map((social) => (
          <SocialIcon key={social.label} social={social} />
        ))}
      </div>
    </div>
  );
};

const TAB_MAP: Record<string, TabName> = {
  about: 'about',
  projects: 'projects',
  resume: 'resume',
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
  position,
}: {
  items: NavItems;
  className?: string;
  onTabClick?: (tab: TabName) => void;
  position?: MotionValue<number>;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [, forceUpdate] = useState(0);

  const activeIndex = items.findIndex((i) => i.isActive);
  const itemEls = items.map((item) => itemRefs.current[item.text] ?? null);

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
                  // A modified click opens a new browser tab with the plain link.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onTabClick(TAB_MAP[item.text]);
                }
              : undefined
          }
        />
      ))}
      {activeIndex !== -1 && (
        <NavUnderline
          containerRef={containerRef}
          itemEls={itemEls}
          activeIndex={activeIndex}
          position={position}
        />
      )}
    </div>
  );
};

const Nav = () => {
  const pathname = usePathname();
  const { activeTab, setActiveTab, isTabRoute, position } = useMobileTab();

  // The tab state changes before the URL, so the underline moves at once.
  const items: NavItems = [
    {
      text: 'about',
      href: '/',
      isActive: isTabRoute ? activeTab === 'about' : pathname === '/',
    },
    {
      text: 'projects',
      isActive: isTabRoute
        ? activeTab === 'projects'
        : pathname.startsWith('/projects'),
    },
    {
      text: 'resume',
      isActive: isTabRoute
        ? activeTab === 'resume'
        : pathname.startsWith('/resume'),
    },
  ];
  const onTabClick = isTabRoute ? setActiveTab : undefined;

  return (
    <nav className="enter w-full flex flex-col text-primary">
      <div className="flex justify-between items-center py-4 md:items-end md:px-0 md:pt-11">
        <Logo />

        {/* Socials beside logo on mobile */}
        <div className="md:hidden">
          <Socials compact />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-end gap-8">
          <NavMenu
            items={items}
            className="items-end gap-8"
            onTabClick={onTabClick}
          />
          <Socials />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pb-4">
          <NavMenu
            items={items}
            className="items-center justify-between w-full"
            onTabClick={onTabClick}
            // Only the mobile layout swipes, so only its bar follows the strip.
            position={isTabRoute ? position : undefined}
          />
        </div>
      </div>
    </nav>
  );
};

export { Nav };
