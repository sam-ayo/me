import { Eye } from "lucide-react"
import { Badge } from "./badge"

const PostPreview = ({title, tags, views }: {title: string, tags: string[], views: number}) => {
    return (
        <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
        <p>{title}</p>
        <div className="flex gap-2">
            {tags.map((tag, index) => {
                return <Badge key={index}>{tag}</Badge>
            })}
        </div>
        </div>
        <div className="flex items-center gap-1">
        <Eye size={12}/>
        <p className="text-xs text-[#B0B0B0]">{views}</p>
        </div>
        </div>
    )
}

export {PostPreview}