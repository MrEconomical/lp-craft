import { Recipes, NameTable } from "../recipes/route"
import { Inventory, getArtifacts, optimizeCrafts } from "./calc"
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

    // Get recipe tables
    let recipes: Recipes
    let names: NameTable
    try {
        const tables = await fetch(`${request.nextUrl.origin}/api/recipes`, {
            next: {
                revalidate: 600, // 10 minutes
            },
        }).then(response => response.json())
        recipes = tables.recipes
        names = tables.names
    } catch(error) {
        return new Response(JSON.stringify({
            error: "unable to get recipes",
        }), { status: 500 })
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

    // Calculate crafts
    try {
        const crafts = await optimizeCrafts(recipes, names, inventory)
        return new Response(JSON.stringify(crafts), { status: 200 })
    } catch {
        return new Response(JSON.stringify({
            error: "unable to calculate crafts",
        }), { status: 500 })
    }
}