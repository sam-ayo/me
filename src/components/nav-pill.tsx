'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion, Transition } from 'motion/react';
import { useState } from 'react';

type Tag = 'heading1' | 'heading2' | 'heading3' | 'paragraph';

interface ExpandablePillProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: Tag[];
}
const sharedStyles =
  'border-solid border-[0.1px]  border-white hover:border-[#A7AB8E] hover:w-[18px] transition-all duration-300';

const Heading1 = () => {
  return <div className={cn(sharedStyles, 'w-[16px]')} />;
};

const Heading2 = () => {
  return <div className={cn(sharedStyles, 'w-[14px]')} />;
};

const Heading3 = () => {
  return <div className={cn(sharedStyles, 'w-[12px]')} />;
};

const Paragraph = () => {
  return (
    <div className={cn(sharedStyles, 'w-[10.5px]', 'border-[#F0F0F0]/60')} />
  );
};
const ExpandablePill = ({ tags, ...props }: ExpandablePillProps) => {
  return (
    <div
      className="h-32 w-[32px] px-2 rounded-lg border-solid border-[0.3px] border-[#928EAB] bg-[#302E3A] flex flex-col items-end justify-center gap-[10px]"
      {...props}
    >
      <div className="flex flex-col items-end justify-center gap-[10px]">
        {tags.slice(0, 10).map((tag, index) => (
          <div key={index}>
            {tag === 'heading1' && <Heading1 />}
            {tag === 'heading2' && <Heading2 />}
            {tag === 'heading3' && <Heading3 />}
            {tag === 'paragraph' && <Paragraph />}
          </div>
        ))}
      </div>
    </div>
  );
};

const tags: Tag[] = [
  'heading1',
  'paragraph',
  'paragraph',
  'paragraph',
  'paragraph',
  'heading2',
  'paragraph',
  'paragraph',
  'heading3',
  'paragraph',
  'paragraph',
  'paragraph',
];

const sharedTransition: Transition = {
  duration: 0.25,
  ease: 'easeOut',
};

export default function NavPill() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="h-32 w-16 fixed left-12 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
      onMouseLeave={() => setIsVisible(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        {!isVisible ? (
          <motion.button
            layoutId="pill"
            transition={sharedTransition}
            className="absolute"
          >
            <ExpandablePill
              tags={tags}
              onMouseEnter={() => setIsVisible(true)}
            />
          </motion.button>
        ) : (
          <motion.div
            layoutId="pill"
            transition={sharedTransition}
            className="border-solid border-[0.3px] border-[#928EAB] bg-[#302E3A] absolute -top-[88px] rounded-lg h-80 w-48"
            key="box"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
