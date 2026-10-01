export type MacArch = 'arm64' | 'x86_64';

export const colimaGuiReleasesPage =
  'https://github.com/sam-ayo/colima-gui-releases/releases/latest';

// The app updater reads this manifest too, so it always names the newest
// installer for each architecture.
const manifestUrl =
  'https://github.com/sam-ayo/colima-gui-releases/releases/latest/download/latest.json';

interface Manifest {
  version: string;
  packages: Record<'aarch64' | 'x86_64', { url: string }>;
}

export interface ColimaGuiRelease {
  version: string;
  downloads: Record<MacArch, string>;
}

export async function getColimaGuiRelease(): Promise<ColimaGuiRelease | null> {
  try {
    const res = await fetch(manifestUrl, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const manifest: Manifest = await res.json();
    return {
      version: manifest.version,
      downloads: {
        arm64: manifest.packages.aarch64.url,
        x86_64: manifest.packages.x86_64.url,
      },
    };
  } catch {
    return null;
  }
}
