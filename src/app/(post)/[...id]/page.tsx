import { getPost } from "@/app/get-posts"
import html from 'remark-html';
import { remark } from "remark";

 export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
  
   const postId = (await params).id
   const post = getPost({postId})
   if(!post) {
    return <div> post does not exist</div>
   }

  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();
   
  return (
    <div className="text-md font-jetbrains-mono prose prose-neutral dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  )
}