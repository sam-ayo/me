import { getPost } from "@/app/get-posts"

 export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
   const postId = (await params).id
   const post = getPost({postId})
   
  return (
      <p>{post?.content}</p>
  )
}