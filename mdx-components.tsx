import { tags } from '@/app/(post)/[...id]/html-tag-styles'
import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...tags,
    ...components,
  }
}