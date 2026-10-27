'use client';

import { Download, FileText, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { pdfFileName } from '@/lib/resume-data';

const PDF_URL = '/api/resume';

/* The width of a letter page at 96dpi. A wide modal shows the page at this
   size and does not stretch it. */
const PAGE_WIDTH = 816;

/* Mobile browsers do not render a PDF in a frame: iOS shows only a static first
   page and Android shows nothing. pdf.js draws each page on a canvas instead,
   which works the same in all browsers. The legacy build supports older mobile
   browsers. */
async function loadPdf() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  return pdfjs.getDocument({ url: PDF_URL });
}

/**
 * Previews the resume PDF in a modal, with a download link beside it.
 *
 * The native dialog element carries the modal behaviour: it renders in the top
 * layer, so the mobile tab strip transform cannot clip it, and it closes on
 * Escape without a key handler.
 *
 * A closed dialog normally has no box. This one keeps a hidden box at the size
 * of the open modal, so the pages load and paint before the reader asks for
 * them and the open shows the finished pages with no flash.
 */
export default function ResumePdfDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  // The closed dialog keeps its box, so `inert` keeps the hidden pages out of
  // the tab order and the accessibility tree.
  const [isOpen, setIsOpen] = useState(false);
  const [bodyWidth, setBodyWidth] = useState(0);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);

  const open = useCallback(() => {
    // The dialog must leave the inert state before `showModal` moves focus into it.
    flushSync(() => setIsOpen(true));
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

  useEffect(() => {
    let cancelled = false;
    const loading = loadPdf();

    loading
      .then((task) => task.promise)
      .then((doc) => {
        if (!cancelled) setPdf(doc);
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to load the resume PDF', error);
      });

    // Destroying the loading task also destroys its document and worker.
    return () => {
      cancelled = true;
      loading.then((task) => task.destroy());
    };
  }, []);

  // The scroll bar takes no width in the body, because `scrollbar-gutter`
  // keeps its space, so the pages cannot feed their height back into a loop.
  useEffect(() => {
    const node = bodyRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setBodyWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const pageWidth = Math.min(bodyWidth, PAGE_WIDTH);

  // A new width draws each page again at the new size. The canvas holds one
  // pixel for each device pixel, so the text stays sharp on a dense screen.
  useEffect(() => {
    if (!pdf || pageWidth <= 0) return;

    let cancelled = false;
    const tasks: RenderTask[] = [];
    const ratio = window.devicePixelRatio || 1;

    for (let index = 0; index < pdf.numPages; index++) {
      pdf.getPage(index + 1).then((page) => {
        const canvas = canvasRefs.current[index];
        if (cancelled || !canvas) return;

        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({
          scale: (pageWidth / base.width) * ratio,
        });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${pageWidth}px`;
        canvas.style.height = `${Math.floor(viewport.height / ratio)}px`;

        const task = page.render({ canvas, viewport });
        tasks.push(task);
        task.promise.catch(() => {
          // A cancelled render rejects, and the next render replaces it.
        });
      });
    }

    return () => {
      cancelled = true;
      tasks.forEach((task) => task.cancel());
    };
  }, [pdf, pageWidth]);

  return (
    <>
      <button
        type="button"
        onClick={open}
        title="Preview resume as PDF"
        className="-m-1.5 flex items-center gap-1 shrink-0 p-1.5 text-secondary transition-[color,transform] duration-150 ease-out active:scale-[0.97] hover:text-primary print:hidden"
      >
        <FileText size={16} />
        <span className="font-plex-mono text-[10px]">pdf</span>
      </button>

      <dialog
        ref={dialogRef}
        inert={!isOpen}
        onClick={handleDialogClick}
        onClose={handleClose}
        aria-label="Resume PDF preview"
        /* A phone gives the page too little room, so the modal fills the screen
           and only takes its inset frame from the small breakpoint up.
           `overflow-hidden` clips the square corners of the preview frame to
           the rounded border.
           The closed state overrides the `display: none` that a closed dialog
           gets by default. It pins the dialog to the same fixed box that the
           modal state uses, so the body measures its final size, and hides it
           with `visibility` so the frame still loads.
           `pdf-dialog` in globals.css fades the modal in. */
        className="pdf-dialog m-0 flex flex-col w-screen h-[100dvh] max-w-none max-h-none p-0 overflow-hidden border-0 bg-background text-primary backdrop:bg-black/60 sm:m-auto sm:w-[min(92vw,56rem)] sm:h-[min(88vh,56rem)] sm:rounded-lg sm:border [&:not([open])]:invisible [&:not([open])]:fixed [&:not([open])]:inset-0"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <p className="font-plex-mono text-xs text-secondary truncate">
            {pdfFileName}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={PDF_URL}
              download={pdfFileName}
              className="-m-1.5 flex items-center gap-1 p-1.5 text-secondary transition-[color,transform] duration-150 ease-out active:scale-[0.97] hover:text-primary"
            >
              <Download size={16} />
              <span className="font-plex-mono text-[10px]">download</span>
            </a>
            <button
              type="button"
              onClick={close}
              title="Close preview"
              aria-label="Close preview"
              className="-m-2 p-2 text-secondary transition-[color,transform] duration-150 ease-out active:scale-[0.97] hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          ref={bodyRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] bg-badge-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6"
        >
          <div
            className="mx-auto flex flex-col gap-3 sm:gap-6"
            style={{ width: pageWidth }}
          >
            {Array.from({ length: pdf?.numPages ?? 0 }, (_, index) => (
              <canvas
                key={index}
                ref={(node) => {
                  canvasRefs.current[index] = node;
                }}
                role="img"
                aria-label={`Resume page ${index + 1}`}
                className="block bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
