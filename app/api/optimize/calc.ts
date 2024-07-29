import { Recipes } from "../recipes/route"

export interface Inventory {
    [artifact: number]: number,
}
export interface Crafts {
    crafts: {
        [artifact: number]: {
            count: number,
            xp: number,
        },
    },
    total_xp: number,
}

/**
 * Fetches and parses the artifact inventory associated with an EID.
 */
export async function getArtifacts(eid: string): Promise<Inventory> {
    return {} as Inventory
}

/**
 * Computes the optimal amount of each artifact to craft.
 */
export function optimizeCrafts(
    recipes: Recipes,
    artifacts: Inventory,
): Crafts {
    return {} as Crafts
}