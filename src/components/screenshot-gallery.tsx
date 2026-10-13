'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export interface Screenshot {
  src: string;
  alt: string;
}

/* The screenshots share one size, so the thumbnails and the preview reserve
   their boxes before the files load. */
const SHOT_WIDTH = 1600;
const SHOT_HEIGHT = 884;

/**
 * Shows a row of screenshot thumbnails. A click on a thumbnail previews the
 * full screenshot in a modal, with the same chrome as the resume PDF preview.
 *
 * The native dialog element carries the modal behaviour: it renders in the top
 * layer, so the mobile tab strip transform cannot clip it, and it closes on
 * Escape without a key handler.
 */
export default function ScreenshotGallery({
  title,
  screenshots,
}: {
  title: string;
  screenshots: Screenshot[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const shot = index === null ? null : screenshots[index];

  const open = useCallback((next: number) => {
    // The image must render before `showModal` moves focus into the dialog.
    flushSync(() => setIndex(next));
    dialogRef.current?.showModal();
    document.body.classList.add('overflow-hidden');
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleClose = useCallback(() => {
    setIndex(null);
    document.body.classList.remove('overflow-hidden');
  }, []);

  const step = useCallback(
    (offset: number) => {
      setIndex((current) =>
        current === null
          ? current
          : (current + offset + screenshots.length) % screenshots.length,
      );
    },
    [screenshots.length],
  );

  // A click on the backdrop falls on the dialog itself, not on its content.
  const handleDialogClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) close();
    },
    [close],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    },
    [step],
  );

  // An open dialog locks the page scroll, so a stuck lock must not outlive it.
  useEffect(() => {
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-1.5">
        {screenshots.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => open(i)}
            title={`Preview: ${item.alt}`}
            className="overflow-hidden rounded-md border"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={SHOT_WIDTH}
              height={SHOT_HEIGHT}
              sizes="(min-width: 768px) 224px, 33vw"
              className="w-full h-auto transition-transform hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        aria-label={`${title} screenshot preview`}
        /* A phone gives the screenshot too little room, so the modal fills the
           screen and only takes its inset frame from the small breakpoint up.
           `overflow-hidden` clips the square corners of the image to the
           rounded border. */
        className="m-0 flex-col w-screen h-[100dvh] max-w-none max-h-none p-0 overflow-hidden border-0 bg-background text-primary backdrop:bg-black/60 open:flex sm:m-auto sm:w-[min(92vw,72rem)] sm:h-auto sm:max-h-[88vh] sm:rounded-lg sm:border"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <p className="font-jetbrains-mono text-xs text-secondary truncate">
            {shot?.alt}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            {screenshots.length > 1 && index !== null && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  title="Previous screenshot"
                  aria-label="Previous screenshot"
                  className="text-secondary hover:text-primary"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-jetbrains-mono text-[10px] text-secondary">
                  {index + 1}/{screenshots.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  title="Next screenshot"
                  aria-label="Next screenshot"
                  className="text-secondary hover:text-primary"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            {shot && (
              <a
                href={shot.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-secondary hover:text-primary"
              >
                <ExternalLink size={16} />
                <span className="font-jetbrains-mono text-[10px]">open</span>
              </a>
            )}
            <button
              type="button"
              onClick={close}
              title="Close preview"
              aria-label="Close preview"
              className="text-secondary hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center bg-badge-background">
          {shot && (
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              width={SHOT_WIDTH}
              height={SHOT_HEIGHT}
              sizes="(min-width: 640px) 72rem, 100vw"
              className="w-full h-auto max-h-full object-contain sm:max-h-[calc(88vh-3rem)]"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
