import { Eye } from "lucide-react"
import { Badge } from "./badge"

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
        <p className="text-sm text-secondary font-jetbrains-mono">{views}</p>
        </div>
        </div>
    )
}

const YearPreviews = ({yearPreviews}: {yearPreviews: YearPreviews}) => {
    return(
        <div className="mt-16 flex flex-col gap-4">
        <p className="text-lg text-secondary font-jetbrains-mono">{yearPreviews.year}</p>
        <div className="flex flex-col">
            {yearPreviews.previews.map(({title, tags, views}, index) => {
                return (
                    <div key={index}>
                        <div className={`group hover:bg-accent/10 px-2 py-3 border-b-2 ${index === 0 ? 'border-t-2' : 'border-b-2'}`}>
                            <PostPreview title={title} tags={tags} views={views}/>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
    )
}

export {PostPreview, YearPreviews}