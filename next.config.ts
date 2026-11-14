import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { withContentCollections } from '@content-collections/next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // The Docker image for the Oracle Cloud VM runs the standalone server.
  output: 'standalone',
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withContentCollections(withMDX(nextConfig));
