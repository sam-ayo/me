import { defineCollection, defineConfig } from "@content-collections/core";
 
const posts = defineCollection({
  name: "posts",
  directory: "/posts",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.string()
  }),
transform: (doc) => {
  const {_meta, ...docRest} = doc
  const {date, ...rest} = docRest
  return {
    ...rest,
    id: _meta.filePath,
    year: _meta.directory,
    date: new Date(date)
  };
},
});
 
export default defineConfig({
  collections: [posts],
});