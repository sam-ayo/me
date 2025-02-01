'use client';

import { useEffect, useRef } from 'react';

export interface PostContent {
  id: string;
  title: string;
  content: string;
  year: string;
  tags: string[];
  date: Date;
  views: number;
}

export const Header = ({ post }: { post: PostContent }) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">
        <div> {post.title}</div>
      </h1>
      <p className="font-mono flex text-xs text-gray-500 dark:text-gray-500">
        <span className="flex-grow">
          <span className="hidden md:inline">
            <span>
              <a
                href="https://x.com/sam_ayo__"
                className="hover:text-gray-800 dark:hover:text-gray-400"
                target="_blank"
              >
                @sam_ayo__
              </a>
            </span>

            <span className="mx-2">|</span>
          </span>

          <span>{post.date?.toDateString()}</span>
        </span>
        <span className="pr-1.5">
          <Views defaultValue={post.views} />
        </span>
      </p>
    </>
  );
};

function Views({ defaultValue }: { defaultValue: number }) {
  const views = defaultValue;
  const didLogViewRef = useRef(false);

  useEffect(() => {
    if ('development' === process.env.NODE_ENV) return;
    if (!didLogViewRef.current) {
      didLogViewRef.current = true;
    }
  });

  return (
    <>{views != null ? <span>{views.toLocaleString()} views</span> : null}</>
  );
}
