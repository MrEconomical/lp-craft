import { Inventory, Crafts, getArtifacts, optimizeCrafts } from "./calc"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Gets the inventory associated with an EID and returns the optimal
 * amount of each artifact to craft.
 */
export async function GET(request: NextRequest): Promise<Response> {
    // Get EID from request query
    const eid = request.nextUrl.searchParams.get("eid")
    if (!eid) {
        return new Response(JSON.stringify({
            error: "no EID provided"
        }), { status: 400 })
    }

    // Get artifact inventory
    let inventory: Inventory
    try {
        inventory = await getArtifacts(eid)
    } catch {
        return new Response(JSON.stringify({
            error: "unable to get artifact inventory",
        }), { status: 500 })
    }

    console.log(inventory)

    return new Response("{}", { status: 200 })
}