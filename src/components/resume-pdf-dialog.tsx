'use client';

import { Download, FileText, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  PageViewport,
  RenderTask,
  TextLayer,
} from 'pdfjs-dist';
import { pdfFileName } from '@/lib/resume-data';

const PDF_URL = '/api/resume';

/* The width of a letter page at 96dpi. A wide modal shows the page at this
   size and does not stretch it. */
const PAGE_WIDTH = 816;

/* Mobile browsers do not render a PDF in a frame: iOS shows only a static first
   page and Android shows nothing. pdf.js draws each page on a canvas instead,
   which works the same in all browsers. The legacy build supports older mobile
   browsers. */
const importPdfjs = () => import('pdfjs-dist/legacy/build/pdf.mjs');

async function loadPdf() {
  const pdfjs = await importPdfjs();
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  return pdfjs.getDocument({ url: PDF_URL });
}

/* A canvas holds only pixels, so the links in the PDF do not work on it. Each
   link gets a transparent anchor at the same place on the page. */
async function renderLinks(
  page: PDFPageProxy,
  viewport: PageViewport,
  layer: HTMLElement,
) {
  const annotations = await page.getAnnotations({ intent: 'display' });
  const links = annotations.flatMap((annotation) => {
    if (annotation.subtype !== 'Link' || !annotation.url) return [];

    const [left, bottom, right, top] = annotation.rect;
    const [x1, y1] = viewport.convertToViewportPoint(left, bottom);
    const [x2, y2] = viewport.convertToViewportPoint(right, top);
    const link = document.createElement('a');
    link.href = annotation.url;
    if (link.protocol.startsWith('http')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    // The text layer already reads the link text, so the anchor names its
    // target instead.
    link.setAttribute('aria-label', annotation.url.replace(/^mailto:/, ''));
    Object.assign(link.style, {
      left: `${Math.min(x1, x2)}px`,
      top: `${Math.min(y1, y2)}px`,
      width: `${Math.abs(x2 - x1)}px`,
      height: `${Math.abs(y2 - y1)}px`,
    });
    return [link];
  });
  layer.replaceChildren(...links);
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
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  /* A new width draws each page again at the new size. The canvas holds one
     pixel for each device pixel, so the text stays sharp on a dense screen.
     Over the canvas, a transparent text layer from pdf.js gives the page text
     to screen readers and to text selection, and a link layer makes the
     links work. */
  useEffect(() => {
    if (!pdf || pageWidth <= 0) return;

    let cancelled = false;
    const tasks: (RenderTask | TextLayer)[] = [];
    const ratio = window.devicePixelRatio || 1;

    for (let index = 0; index < pdf.numPages; index++) {
      Promise.all([pdf.getPage(index + 1), importPdfjs()]).then(
        ([page, { TextLayer }]) => {
          const wrapper = pageRefs.current[index];
          const canvas = wrapper?.querySelector('canvas');
          const textLayer = wrapper?.querySelector<HTMLElement>('.pdf-text');
          const linkLayer = wrapper?.querySelector<HTMLElement>('.pdf-links');
          if (cancelled || !wrapper || !canvas || !textLayer || !linkLayer) {
            return;
          }

          const scale = pageWidth / page.getViewport({ scale: 1 }).width;
          const viewport = page.getViewport({ scale });
          const pixels = page.getViewport({ scale: scale * ratio });
          canvas.width = Math.floor(pixels.width);
          canvas.height = Math.floor(pixels.height);
          wrapper.style.width = `${pageWidth}px`;
          wrapper.style.height = `${Math.floor(viewport.height)}px`;
          wrapper.style.setProperty('--total-scale-factor', `${scale}`);

          const render = page.render({ canvas, viewport: pixels });
          render.promise.catch(() => {
            // A cancelled render rejects, and the next render replaces it.
          });

          textLayer.replaceChildren();
          const text = new TextLayer({
            textContentSource: page.streamTextContent(),
            container: textLayer,
            viewport,
          });
          text.render().catch(() => {
            // A cancelled text layer rejects, and the next one replaces it.
          });

          tasks.push(render, text);
          renderLinks(page, viewport, linkLayer).catch((error) =>
            console.error('Failed to read the resume PDF links', error),
          );
        },
      );
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
              <div
                key={index}
                ref={(node) => {
                  pageRefs.current[index] = node;
                }}
                role="group"
                aria-label={`Resume page ${index + 1}`}
                className="relative bg-white shadow-sm"
              >
                <canvas aria-hidden className="block size-full" />
                {/* pdf.js and `renderLinks` fill these layers, so React
                    renders them empty and never reads their children. */}
                <div className="pdf-text" />
                <div className="pdf-links" />
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
