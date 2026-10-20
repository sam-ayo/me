import path from 'node:path';
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { withContentCollections } from '@content-collections/next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // A stray lockfile in the home folder makes Next.js pick the wrong root.
  outputFileTracingRoot: path.join(__dirname),
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withContentCollections(withMDX(nextConfig));

// Gives `next dev` access to the Cloudflare bindings.
initOpenNextCloudflareForDev();
