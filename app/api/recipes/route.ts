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
    } | null,
    crafting_xp: number,
}
interface ArtifactFamily {
    tiers: Artifact[],
}

export interface Recipes {
    [artifact: number]: {
        ingredients: Record<number, number>,
        xp: number,
    } | null,
}
export interface NameTable {
    [artifact: number]: string,
}

// Enable caching with a 1 hour expiry
export const revalidate = 3600

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
            error: "unable to get recipes",
        }), { status: 500 })
    }

    // Generate recipe and name tables
    const { recipes, names } = getArtifactTables(families)
    return new Response(
        JSON.stringify({ recipes, names }),
        { status: 200 },
    )
}

/**
 * Computes crafting recipe and artifact hash to name tables.
 */
function getArtifactTables(families: ArtifactFamily[]): {
    recipes: Recipes,
    names: NameTable,
} {
    const recipes: Recipes = {}
    const names: NameTable = {}
    const artifacts = families.flatMap(family => family.tiers)

    for (const artifact of artifacts) {
        const key = hashArtifact(artifact)
        names[key] = artifact.id
        if (!artifact.recipe) {
            recipes[key] = null
            continue
        }

        recipes[key] = {
            ingredients: {},
            xp: artifact.crafting_xp,
        }
        for (const ingredient of artifact.recipe.ingredients) {
            const ingredientKey = hashArtifact(ingredient)
            recipes[key].ingredients[ingredientKey] = ingredient.count
        }
    }

    return { recipes, names }
}

/**
 * Computes a unique numerical hash for an artifact.
 */
function hashArtifact(artifact: BaseArtifact): number {
    const MAX_LEVEL = 3
    return artifact.afx_id * (MAX_LEVEL + 1) + artifact.afx_level
}