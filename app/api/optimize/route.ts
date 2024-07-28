import { getArtifacts, optimizeCrafts } from "./calc"

import { NextRequest } from "next/server"

/**
 * Gets the inventory associated with an EID and returns the optimal
 * amount of each artifact to craft.
 */
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