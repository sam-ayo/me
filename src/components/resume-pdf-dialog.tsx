'use client';

import { Download, FileText, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { pdfFileName } from '@/lib/resume-data';

const PDF_URL = '/api/resume';

/* The viewer chrome duplicates the dialog header, so the frame hides it. */
const PREVIEW_URL = `${PDF_URL}#toolbar=0&navpanes=0&view=FitH`;

/**
 * Previews the resume PDF in a modal, with a download link beside it.
 *
 * The native dialog element carries the modal behaviour: it renders in the top
 * layer, so the mobile tab strip transform cannot clip it, and it closes on
 * Escape without a key handler.
 */
export default function ResumePdfDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The frame only loads once the reader asks for the preview.
  const [hasOpened, setHasOpened] = useState(false);

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
        /* `overflow-hidden` clips the square corners of the preview frame to
           the rounded border. */
        className="w-[min(92vw,56rem)] h-[min(88vh,56rem)] p-0 overflow-hidden rounded-lg border bg-background text-primary backdrop:bg-black/60 open:flex open:flex-col"
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

        <div className="flex-1 min-h-0 bg-badge-background">
          {hasOpened && (
            <iframe
              src={PREVIEW_URL}
              title="Resume PDF preview"
              className="w-full h-full border-0"
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
