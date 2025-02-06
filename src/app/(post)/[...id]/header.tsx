'use client';

import { useViews } from '@/hooks/use-views';
import { useEffect, useRef, useState } from 'react';

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

          <span>{post.date.toDateString()}</span>
        </span>
        <span className="pr-1.5">
          <Views defaultValue={post.views} postId={post.id} />
        </span>
      </p>
    </>
  );
};

function Views({
  defaultValue,
  postId,
}: {
  defaultValue: number;
  postId: string;
}) {
  const { mutate, data, isSuccess } = useViews();
  const didLogViewRef = useRef(false);
  const [views, setViews] = useState(defaultValue);

  useEffect(() => {
    if (isSuccess) {
      setViews(() => data.data.message);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    if (!didLogViewRef.current) {
      // update views count optimistically
      setViews((prev) => prev + 1);
      mutate(postId);
      didLogViewRef.current = true;
    }
  }, [postId, mutate]);

  return (
    <>
      {views != null ? (
        <span>
          {views.toLocaleString()} {views == 1 ? 'view' : 'views'}
        </span>
      ) : null}
    </>
  );
}
