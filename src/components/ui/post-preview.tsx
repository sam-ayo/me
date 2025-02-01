'use client';
import { ChevronDown, Eye } from 'lucide-react';
import { Badge } from './badge';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { YearPosts } from '@/app/(post)/Post';
import Link from 'next/link';

const PostPreview = ({
  id,
  title,
  tags,
  views,
}: {
  id: string;
  title: string;
  tags: string[];
  views: number;
}) => {
  return (
    <Link href={`${id}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <p className="group-hover:underline cursor-pointer">{title}</p>
          <div className="flex items-center gap-1 shrink-0">
            <Eye size={12} />
            <p className="text-sm text-secondary font-jetbrains-mono">
              {(views ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 cursor-default">
          {tags.map((tag, index) => {
            return (
              <Badge
                className="font-jetbrains-mono whitespace-nowrap"
                key={index}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

const YearPreviews = ({ yearPreviews }: { yearPreviews: YearPosts }) => {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(() => {
    // Only run this on client-side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`yearPreview_${yearPreviews.year}`);
      if (saved !== null) {
        return saved === 'true';
      }
      return yearPreviews.year === currentYear;
    }
    return yearPreviews.year === currentYear;
  });

  useEffect(() => {
    localStorage.setItem(`yearPreview_${yearPreviews.year}`, String(isOpen));
  }, [isOpen, yearPreviews.year]);

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div
        className="text-lg text-secondary font-jetbrains-mono cursor-pointer hover:opacity-80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {yearPreviews.year}
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && yearPreviews.posts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col">
              <div className="border-b transition-all" />
              {yearPreviews.posts.map(({ id, title, tags, views }, index) => {
                return (
                  <div key={index} className="group hover:bg-accent/10">
                    <div className="px-2 py-3">
                      <PostPreview
                        id={id}
                        title={title}
                        tags={tags}
                        views={views}
                      />
                    </div>
                    {index < yearPreviews.posts.length - 1 && (
                      <div className="border-b transition-all group-hover:border-transparent" />
                    )}
                  </div>
                );
              })}
              <div className="border-b transition-all" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { PostPreview, YearPreviews };
