import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    // Get EID from request query
    const eid = request.nextUrl.searchParams.get("eid")
    if (!eid) {
        return new Response(JSON.stringify({
            error: "no EID provided"
        }), { status: 400 })
    }

    console.log(eid)

    return new Response("{}", { status: 200 })
}

export const dynamic = "force-dynamic"