/**
 * Exports a mapping from artifact names to crafting info.
 */

import recipeData from "./recipes.json"

export interface Recipes {
    [artifact: string]: {
        ingredients: Record<string, number>,
        xp: number,
    } | null,
}

export const recipes = recipeData as Recipes