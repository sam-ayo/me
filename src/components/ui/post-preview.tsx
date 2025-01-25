"use client"
import { Eye } from "lucide-react"
import { Badge } from "./badge"
import {motion, AnimatePresence} from 'motion/react'
import { useEffect, useState } from "react";

interface Preview {
    title: string;
    tags: string[];
    views: number;
}

interface YearPreviews {
    year: number;
    previews: Preview[]
}

const PostPreview = ({title, tags, views }: {title: string, tags: string[], views: number}) => {
    return (
        <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
        <p className="group-hover:underline cursor-pointer">{title}</p>
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
    )
}

const YearPreviews = ({yearPreviews}: {yearPreviews: YearPreviews}) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentYear = new Date().getFullYear()

    useEffect(() => {
        setIsOpen(yearPreviews.year === currentYear);
    }, [yearPreviews.year, currentYear]);

    return(
        <div className="mt-16 flex flex-col gap-4">
            <p 
                className="text-lg text-secondary font-jetbrains-mono cursor-pointer hover:opacity-80"
                onClick={() => setIsOpen(!isOpen)}
            >
                {yearPreviews.year}
            </p>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col"
                    >
                        {yearPreviews.previews.map(({title, tags, views}, index) => {
                            return (
                                <div key={index}>
                                    <div className={`group hover:bg-accent/10 px-2 py-3 border-b-2 ${index === 0 ? 'border-t-2' : 'border-b-2'}`}>
                                        <PostPreview title={title} tags={tags} views={views}/>
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