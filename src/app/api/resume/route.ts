import { renderToBuffer } from '@react-pdf/renderer';
import ResumePdf from '@/components/resume-pdf';
import { pdfFileName } from '@/lib/resume-data';

export const runtime = 'nodejs';

// The resume data is static, so the build renders the PDF once and the
// download is a plain static file fetch.
export const dynamic = 'force-static';

export async function GET() {
  const pdf = await renderToBuffer(ResumePdf());

  /* `inline` lets the preview frame render the PDF. The download link carries
     the `download` attribute, which takes priority for a same-origin file, so
     the same route still saves under `pdfFileName`. */
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${pdfFileName}"`,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
