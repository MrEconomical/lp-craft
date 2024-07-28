import { NextRequest } from "next/server"

export type Recipes = Record<string, {
    ingredients: Record<string, number>,
    xp: number,
}>

/**
 * Fetches crafting recipes from the wasmegg GitHub and constructs a table.
 */
export async function GET(request: NextRequest) {
    return new Response("{}", { status: 200 })
}