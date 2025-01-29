import { getPost } from "@/app/get-posts"
import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { tags } from "./html-tag-styles";

 export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  
   const postId = (await params).id
   const post = getPost({postId})
   if(!post) {
    return <div> post does not exist</div>
   }

   
  return (
    <div className="text-md font-jetbrains-mono prose prose-neutral dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{...tags}}
      >{post.content}</Markdown>
    </div>
  )
}