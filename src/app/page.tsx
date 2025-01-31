"use client";

import {  YearPreviews } from "@/components/ui/post-preview";
import { getPostPreview } from "./get-posts";


export default function Home() {
 const allPosts = getPostPreview()
 return (
     <>
    {allPosts.map((yearPreview, index) => {
        return <YearPreviews key={index} yearPreviews={yearPreview}/>
    })}
     </>
 );
}
