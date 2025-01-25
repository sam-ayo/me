import { Post, YearPosts  } from "@/components/ui/post-preview";
import { allPosts } from "content-collections";

const getPosts = () => {
    const posts: YearPosts[] = [] 
     allPosts.forEach(p => {
        const yearPost = posts.find((post)=> post.year == parseInt(p.year))

        const post: Post = {
            title: p.title,
            tags: p.tags,
            date: p.date,
            content: p.content,
            views: 1222,
        }

        if(!yearPost) {
            posts.push({
                year: parseInt(p.year, 10),
                posts: [post]
            })
        }else{
            yearPost.posts.push(post)
        }
    })
    console.log(posts);
    posts.sort((a,b ) => b.year - a.year )
    return posts
}

export {getPosts}