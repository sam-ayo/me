import { NextRequest, NextResponse } from 'next/server';
import {
  colimaGuiReleasesPage,
  getColimaGuiRelease,
  type MacArch,
} from '@/lib/colima-gui-release';

// The download link sends `?arch=` after it inspects the browser. Without
// JavaScript, Chromium can still send the architecture as a client hint.
// Most Macs in use have Apple silicon, so that is the default.
function resolveArch(req: NextRequest): MacArch {
  const param = req.nextUrl.searchParams.get('arch');
  if (param === 'arm64' || param === 'x86_64') return param;

  const hint = req.headers.get('sec-ch-ua-arch')?.replaceAll('"', '');
  if (hint === 'x86') return 'x86_64';

  return 'arm64';
}

export async function GET(req: NextRequest) {
  const release = await getColimaGuiRelease();
  const target = release
    ? release.downloads[resolveArch(req)]
    : colimaGuiReleasesPage;

  return NextResponse.redirect(target, {
    status: 302,
    headers: { 'Cache-Control': 'no-store', Vary: 'Sec-CH-UA-Arch' },
  });
}
