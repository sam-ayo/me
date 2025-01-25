"use client";

import {  YearPreviews } from "@/components/ui/post-preview";
import {  yearPreviews } from "./mock";




export default function Home() {

 return (
     <>
    {yearPreviews.map((yearPreview, index) => {
        return <YearPreviews key={index} yearPreviews={yearPreview}/>
    })}
     </>
 );
}
