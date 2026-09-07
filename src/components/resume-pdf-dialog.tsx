'use client';

import { Download, FileText, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { pdfFileName } from '@/lib/resume-data';

const PDF_URL = '/api/resume';

/* The viewer chrome duplicates the dialog header, so the frame hides it. */
const PREVIEW_URL = `${PDF_URL}#toolbar=0&navpanes=0&view=FitH`;

/* The width of a letter page at 96dpi. A mobile viewer lays a framed PDF out at
   the page width and crops the overflow, so the frame keeps this width and CSS
   scales the frame down to the modal. */
const PAGE_WIDTH = 816;

/**
 * Previews the resume PDF in a modal, with a download link beside it.
 *
 * The native dialog element carries the modal behaviour: it renders in the top
 * layer, so the mobile tab strip transform cannot clip it, and it closes on
 * Escape without a key handler.
 */
export default function ResumePdfDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // The frame only loads once the reader asks for the preview.
  const [hasOpened, setHasOpened] = useState(false);
  // A closed dialog has no box, so the body measures zero until the first open.
  const [body, setBody] = useState({ width: 0, height: 0 });

  const open = useCallback(() => {
    setHasOpened(true);
    dialogRef.current?.showModal();
    document.body.classList.add('overflow-hidden');
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // A click on the backdrop falls on the dialog itself, not on its content.
  const handleDialogClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) close();
    },
    [close],
  );

  // An open dialog locks the page scroll, so a stuck lock must not outlive it.
  useEffect(() => {
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  // The body sizes itself from the dialog, never from the frame, so the frame
  // cannot feed its own measurement back into a loop.
  useEffect(() => {
    const node = bodyRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBody({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* A modal wider than the page shows the page at its own size. A narrower one
     shrinks the whole frame, so a scaled frame still covers the body exactly. */
  const scale = body.width > 0 ? Math.min(1, body.width / PAGE_WIDTH) : 1;

  return (
    <>
      <button
        type="button"
        onClick={open}
        title="Preview resume as PDF"
        className="flex items-center gap-1 shrink-0 text-secondary hover:text-primary print:hidden"
      >
        <FileText size={16} />
        <span className="font-jetbrains-mono text-[10px]">pdf</span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onClose={() => document.body.classList.remove('overflow-hidden')}
        aria-label="Resume PDF preview"
        /* A phone gives the page too little room, so the modal fills the screen
           and only takes its inset frame from the small breakpoint up.
           `overflow-hidden` clips the square corners of the preview frame to
           the rounded border. */
        className="m-0 w-screen h-[100dvh] max-w-none max-h-none p-0 overflow-hidden border-0 bg-background text-primary backdrop:bg-black/60 open:flex open:flex-col sm:m-auto sm:w-[min(92vw,56rem)] sm:h-[min(88vh,56rem)] sm:rounded-lg sm:border"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <p className="font-jetbrains-mono text-xs text-secondary truncate">
            {pdfFileName}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={PDF_URL}
              download={pdfFileName}
              className="flex items-center gap-1 text-secondary hover:text-primary"
            >
              <Download size={16} />
              <span className="font-jetbrains-mono text-[10px]">download</span>
            </a>
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

        <div
          ref={bodyRef}
          className="flex-1 min-h-0 overflow-hidden bg-badge-background"
        >
          {hasOpened && body.width > 0 && (
            <iframe
              src={PREVIEW_URL}
              title="Resume PDF preview"
              className="border-0 origin-top-left"
              style={{
                width: body.width / scale,
                height: body.height / scale,
                transform: `scale(${scale})`,
              }}
            />
          )}
        </div>

        {/* Mobile browsers render a framed PDF as a single static page, so the
            reader needs a way to reach the full document. */}
        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-t px-4 py-3 font-jetbrains-mono text-[10px] text-secondary hover:text-primary sm:hidden"
        >
          open the full PDF in a new tab ↗
        </a>
      </dialog>
    </>
  );
}
