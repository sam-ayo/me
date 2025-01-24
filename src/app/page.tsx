"use client";

import { PostPreview } from "@/components/ui/post-preview";

const previews = [
    {
        title: 'thoughts in the AI space: 2025',
        tags: ['ai', 'future', 'agents'],
        views: 12222
    },
    {
        title: 'unique across time and space: uuids',
        tags: ['uuid', 'rfc 4122'],
        views: 654
    },
    {
        title: 'building a type-safe API with tRPC',
        tags: ['typescript', 'trpc', 'api'],
        views: 210
    },
    {
        title: 'rust vs go: choosing your systems language',
        tags: ['rust', 'go', 'systems'],
        views: 5127
    },
    {
        title: 'the art of technical writing',
        tags: ['writing', 'documentation', 'communication'],
        views: 1984
    },
    {
        title: 'implementing CRDT for real-time collaboration',
        tags: ['distributed-systems', 'crdt', 'real-time'],
        views: 4385
    },
    {
        title: 'modern CSS: embracing container queries',
        tags: ['css', 'frontend', 'responsive'],
        views: 7234
    }
]

export default function Home() {

 return (
    <div className="mt-24 px-80">
        <div className="flex flex-col">
            {previews.map(({title, tags, views}, index) => {
                return (
                    <div key={index}>
                        <div className={`hover:bg-[#333]/25 px-2 py-3 border-b-2 ${index === 0 ? 'border-t-2' : 'border-b-2'}`}>
                            <PostPreview title={title} tags={tags} views={views}/>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
 );
}
