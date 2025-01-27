"use client";

import {  YearPreviews } from "@/components/ui/post-preview";
import { getPosts } from "./get-posts";


export default function Home() {
 const allPosts = getPosts()
 return (
     <>
     in progress 🚧....
    {allPosts.map((yearPreview, index) => {
        return <YearPreviews key={index} yearPreviews={yearPreview}/>
    })}
     </>
 );
}
