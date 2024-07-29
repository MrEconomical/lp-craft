interface BaseArtifact {
    afx_id: number,
    afx_level: number,
}
interface Ingredient extends BaseArtifact {
    count: number,
}
interface Artifact extends BaseArtifact {
    id: string,
    recipe: {
        ingredients: Array<Ingredient>,
    },
}

export type Recipes = {
    [key: number]: {
        ingredients: Record<number, number>,
        xp: number,
    } | null,
}
export type NameTable = Record<number, string>

export const revalidate = 3600 // 1 hour

/**
 * Fetches crafting recipes from the wasmegg GitHub and constructs a data table.
 */
export async function GET() {

    return new Response(JSON.stringify({
        recipes: {},
        names: {},
    }), { status: 200 })
}

/**
 * Computes a unique numerical hash for an artifact.
 */
function hashArtifact(artifact: BaseArtifact) {
    return artifact.afx_id * 4 + artifact.afx_level
}