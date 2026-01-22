import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }>}
){
    const id = (await params).id;
    // Query database for user with that ID
    return new Response(JSON.stringify({ id, name: 'User ${id}'}), {
        status: 200,
        headers: { 'Content-Type': 'application/json'}
    });    
}

//Can colocate the DELETE or POST endpoints in here as well
