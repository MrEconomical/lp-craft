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
        ingredients: Ingredient[],
    },
}
interface ArtifactFamily {
    tiers: Artifact[],
}

export interface Recipes {
    [key: number]: {
        ingredients: Record<number, number>,
        xp: number,
    } | null,
}
export interface NameTable {
    [key: number]: string,
}

export const revalidate = 3600 // 1 hour

/**
 * Fetches crafting recipes and constructs recipe and artifact hash tables.
 */
export async function GET(): Promise<Response> {
    // Get artifact family data from wasmegg GitHub
    let families: ArtifactFamily[]
    try {
        const RECIPES_URL = "https://raw.githubusercontent.com/carpetsage/egg/main/wasmegg/_common/eiafx/eiafx-data.json"
        const recipes = await fetch(RECIPES_URL).then(response => response.json())
        families = recipes.artifact_families
    } catch {
        return new Response(JSON.stringify({
            error: "unable to fetch recipes",
        }), { status: 500 })
    }

    console.log(families)

    return new Response(JSON.stringify({
        recipes: {},
        names: {},
    }), { status: 200 })
}

/**
 * Computes a unique numerical hash for an artifact.
 */
function hashArtifact(artifact: BaseArtifact): number {
    return artifact.afx_id * 4 + artifact.afx_level
}