import { NextRequest, NextResponse } from "next/server";
import { cacheClient } from "../../../../redis";

export async function POST(request: NextRequest) {
    // const {postId} = await request.json();
    // try {
    // const noOfViews = await cacheClient.get(postId)
    // if(!noOfViews) {
    //     await cacheClient.set(postId, 1);
    //     return NextResponse.json({message: 'First view 🚀'})
    // }
    // await cacheClient.set(postId, parseInt(noOfViews, 10)+1)
    // return NextResponse.json({message: "+1 view 🔥"})
    // } catch (error) {
    //     console.log(error)
    //     return NextResponse.json({message: error})
    // }
}
