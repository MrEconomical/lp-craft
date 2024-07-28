type Recipes = Record<string, {
    ingredients: Record<string, number>,
    xp: number,
}>
type Inventory = Record<string, number>
type Crafts = {
    crafts: Record<string, number>,
    xp: number,
}

/**
 * Fetches and parses the artifact inventory associated with an EID.
 */
async function getArtifacts(eid: string) {
    return {} as Inventory
}

/**
 * Computes the optimal amount of each artifact to craft.
 */
async function optimizeCrafts(recipes: Recipes, artifacts: Inventory) {
    return {} as Crafts
}

export { getArtifacts, optimizeCrafts }