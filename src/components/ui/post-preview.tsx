"use client"
import {  ChevronDown,   Eye } from "lucide-react"
import { Badge } from "./badge"
import {motion, AnimatePresence} from 'motion/react'
import { useEffect, useState } from "react";
import { YearPosts } from "@/app/(post)/Post";
import Link from "next/link";


const PostPreview = ({id, title, tags, views }: {id: string, title: string, tags: string[], views: number}) => {
    return (
        <Link href={`${id}`}>
        <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
        <p className="group-hover:underline cursor-pointer font-menlo">{title}</p>
        <div className="flex gap-2 cursor-default">
            {tags.map((tag, index) => {
                return <Badge className="font-jetbrains-mono" key={index}>{tag}</Badge>
            })}
        </div>
        </div>
        <div className="flex items-center gap-1">
        <Eye size={12}/>
        <p className="text-sm text-secondary font-jetbrains-mono">{views.toLocaleString()}</p>
        </div>
        </div>
        </Link>
    )
}

const YearPreviews = ({yearPreviews}: {yearPreviews: YearPosts}) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentYear = new Date().getFullYear()

    useEffect(() => {
        const saved = localStorage.getItem(`yearPreview_${yearPreviews.year}`);
        if (saved !== null) {
            setIsOpen(saved === 'true');
        } else {
            setIsOpen(yearPreviews.year === currentYear);
        }
    }, [yearPreviews.year, currentYear]);

    useEffect(() => {
        localStorage.setItem(`yearPreview_${yearPreviews.year}`, String(isOpen));
    }, [isOpen, yearPreviews.year]);

    return(
        <div className="mt-16 flex flex-col gap-4">
            <div 
                className="text-lg text-secondary font-jetbrains-mono cursor-pointer hover:opacity-80"
                onClick={() => setIsOpen(!isOpen)}
            >
            <div className="flex items-center gap-2">
                {yearPreviews.year}
                <motion.div
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.5 }}
                >
                    <ChevronDown size={16} />
                </motion.div>
            </div>
            </div>
            <AnimatePresence>
                {isOpen && yearPreviews.posts.length > 0 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col"
                    >
                        {yearPreviews.posts.map(({id, title, tags, views}, index) => {
                            return (
                                <div key={index}>
                                    <div className={`group hover:bg-accent/10 px-2 py-3 border-b-2 ${index === 0 ? 'border-t-2' : 'border-b-2'}`}>
                                        <PostPreview id={id} title={title} tags={tags} views={views}/>
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export {PostPreview, YearPreviews}