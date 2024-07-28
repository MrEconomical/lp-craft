type Recipes = Record<string, {
    ingredients: Record<string, number>,
    xp: number,
}>
type Inventory = Record<string, number>

/**
 * Fetches and parses the artifact inventory associated with an EID.
 */
async function getArtifacts(eid: string) {
    return {}
}

/**
 * Computes the optimal amount of each artifact to craft.
 */
async function optimizeCrafts(recipes: Recipes, artifacts: Inventory) {
    return {}
}

export { getArtifacts, optimizeCrafts }