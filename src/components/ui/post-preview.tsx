"use client"
import {  ChevronDown,   Eye } from "lucide-react"
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
    )
}

const YearPreviews = ({yearPreviews}: {yearPreviews: YearPreviews}) => {
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem(`yearPreview_${yearPreviews.year}`);
        return saved === 'true';
    });
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
            <p 
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
            </p>
            <AnimatePresence>
                {isOpen && yearPreviews.previews.length > 0 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
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