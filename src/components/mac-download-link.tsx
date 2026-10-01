'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { MacArch } from '@/lib/colima-gui-release';

interface UADataWithArch {
  getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>;
}

async function detectMacArch(): Promise<MacArch> {
  // Chromium browsers report the real CPU architecture.
  const uaData = (navigator as Navigator & { userAgentData?: UADataWithArch })
    .userAgentData;
  if (uaData?.getHighEntropyValues) {
    try {
      const { architecture } = await uaData.getHighEntropyValues([
        'architecture',
      ]);
      if (architecture === 'arm') return 'arm64';
      if (architecture === 'x86') return 'x86_64';
    } catch {}
  }

  // Safari and Firefox always report "Intel Mac OS X", so ask the GPU.
  // Intel Macs have Intel, AMD, or NVIDIA graphics. Only Apple silicon GPUs
  // support ASTC textures.
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debug
        ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
        : '';
      if (/intel|amd|radeon|nvidia/i.test(renderer)) return 'x86_64';
      if (/apple m\d/i.test(renderer)) return 'arm64';
      return gl.getExtension('WEBGL_compressed_texture_astc')
        ? 'arm64'
        : 'x86_64';
    }
  } catch {}

  return 'arm64';
}

export function MacDownloadLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, and so on) use the plain link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    const arch = await detectMacArch();
    window.location.assign(`${href}?arch=${arch}`);
  };

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
