'use client';
import { ChevronDown, Eye, Calendar } from 'lucide-react';
import { Badge } from './badge';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { YearPosts } from '@/app/(post)/Post';
import Link from 'next/link';

const usePostViews = () => {
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/posts/views')
      .then((res) => res.json())
      .then(setViews)
      .catch(() => {});
  }, []);

  return views;
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const PostPreview = ({
  id,
  title,
  tags,
  views,
  date,
}: {
  id: string;
  title: string;
  tags: string[];
  views: number;
  date: Date;
}) => {
  return (
    <Link href={`${id}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <p className="group-hover:underline cursor-pointer">{title}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1">
              <Calendar size={10} className="text-secondary" />
              <p className="text-xs text-secondary font-jetbrains-mono">
                {formatDate(date)}
              </p>
            </div>
            <div className="flex items-center gap-1 min-w-[3.5rem]">
              <AnimatePresence>
                {views > 0 && (
                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
                  >
                    <Eye size={12} />
                    <p className="text-sm text-secondary font-jetbrains-mono whitespace-nowrap">
                      {views.toLocaleString()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

const YearPreviews = ({
  yearPreviews,
  views,
}: {
  yearPreviews: YearPosts;
  views: Record<string, number>;
}) => {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(yearPreviews.year === currentYear);

  useEffect(() => {
    const saved = localStorage.getItem(`yearPreview_${yearPreviews.year}`);
    if (saved !== null) {
      setIsOpen(saved === 'true');
    }
  }, [yearPreviews.year]);

  useEffect(() => {
    localStorage.setItem(`yearPreview_${yearPreviews.year}`, String(isOpen));
  }, [isOpen, yearPreviews.year]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div
        className="text-lg text-secondary font-jetbrains-mono cursor-pointer hover:opacity-80"
        onClick={handleToggle}
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
      {yearPreviews.posts.length === 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={
            isOpen
              ? { duration: 0.2 }
              : { duration: 0.15 }
          }
          style={{ overflow: 'hidden' }}
        >
          <p className="text-secondary text-sm mt-2">No posts yet.</p>
        </motion.div>
      )}
      {yearPreviews.posts.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={
            isOpen
              ? {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2, delay: 0.05 },
                }
              : {
                  height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.15 },
                }
          }
          style={{ overflow: 'hidden' }}
        >
          <div className="flex flex-col">
            <div className="border-b transition-all" />
            {yearPreviews.posts.map(
              ({ id, title, tags, date }, index) => {
                return (
                  <div key={index} className="group hover:bg-accent/10">
                    <div className="px-2 py-3">
                      <PostPreview
                        id={id}
                        title={title}
                        tags={tags}
                        views={views[id] ?? 0}
                        date={date}
                      />
                    </div>
                    {index < yearPreviews.posts.length - 1 && (
                      <div className="border-b transition-all group-hover:border-transparent" />
                    )}
                  </div>
                );
              },
            )}
            <div className="border-b transition-all" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

const WritingsList = ({ allPosts }: { allPosts: YearPosts[] }) => {
  const views = usePostViews();
  const currentYear = new Date().getFullYear();
  const hasCurrentYear = allPosts.some((yp) => yp.year === currentYear);
  const posts = hasCurrentYear
    ? allPosts
    : [{ year: currentYear, posts: [] }, ...allPosts];

  return (
    <>
      {posts.map((yearPreview, index) => (
        <YearPreviews
          key={index}
          yearPreviews={yearPreview}
          views={views}
        />
      ))}
    </>
  );
};

export { PostPreview, YearPreviews, WritingsList };
