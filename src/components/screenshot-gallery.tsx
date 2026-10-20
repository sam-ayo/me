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
 *
 * A closed dialog normally has no box. This one keeps a hidden box at the size
 * of the open modal, and it stacks every screenshot in that box. Thus the
 * screenshots load and paint before the reader asks for them, and the open
 * shows the image with no delay.
 */
export default function ScreenshotGallery({
  title,
  screenshots,
}: {
  title: string;
  screenshots: Screenshot[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The closed dialog keeps its box, so `inert` keeps the hidden screenshots
  // out of the tab order and the accessibility tree.
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const shot = screenshots[index];

  const open = useCallback((next: number) => {
    // The dialog must leave the inert state before `showModal` moves focus into it.
    flushSync(() => {
      setIndex(next);
      setIsOpen(true);
    });
    dialogRef.current?.showModal();
    document.body.classList.add('overflow-hidden');
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove('overflow-hidden');
  }, []);

  const step = useCallback(
    (offset: number) => {
      setIndex(
        (current) =>
          (current + offset + screenshots.length) % screenshots.length,
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
            // `relative` lifts the thumbnail above the row link of the card.
            className="relative overflow-hidden rounded-md border"
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
        inert={!isOpen}
        onClick={handleDialogClick}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        aria-label={`${title} screenshot preview`}
        /* A phone gives the screenshot too little room, so the modal fills the
           screen and only takes its inset frame from the small breakpoint up.
           `overflow-hidden` clips the square corners of the image to the
           rounded border.
           The closed state overrides the `display: none` that a closed dialog
           gets by default. It pins the dialog to the same fixed box that the
           modal state uses, and hides it with `visibility` so the screenshots
           still load and paint. */
        className="m-0 flex flex-col w-screen h-[100dvh] max-w-none max-h-none p-0 overflow-hidden border-0 bg-background text-primary backdrop:bg-black/60 sm:m-auto sm:w-[min(92vw,72rem)] sm:h-auto sm:max-h-[88vh] sm:rounded-lg sm:border [&:not([open])]:invisible [&:not([open])]:fixed [&:not([open])]:inset-0"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <p className="font-plex-mono text-xs text-secondary truncate">
            {shot?.alt}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            {screenshots.length > 1 && (
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
                <span className="font-plex-mono text-[10px] text-secondary">
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
                <span className="font-plex-mono text-[10px]">open</span>
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

        {/* The screenshots share one grid cell, so a step swaps the visible
            one without a load. */}
        <div className="flex-1 min-h-0 grid place-items-center bg-badge-background">
          {screenshots.map((item, i) => (
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              width={SHOT_WIDTH}
              height={SHOT_HEIGHT}
              sizes="(min-width: 640px) 72rem, 100vw"
              loading="eager"
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 w-full h-auto max-h-full object-contain sm:max-h-[calc(88vh-3rem)] ${
                i === index ? '' : 'invisible'
              }`}
            />
          ))}
        </div>
      </dialog>
    </>
  );
}
