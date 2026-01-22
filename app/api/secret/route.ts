import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return new Response(JSON.stringify({secret: 'Authenticated users can see this'}), {
        headers: { 'Content-Type': 'application/json'},
    });
}