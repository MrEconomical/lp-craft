import { Inventory } from "./api/inventory/route"
import { Recipes, recipes } from "../data/recipes"

export interface Highs {
    solve: (problem: string) => any,
}
export interface Solution {
    crafts: {
        [artifact: string]: {
            count: number,
            xp: number,
        },
    },
    totalXp: number,
}

/**
 * Calculates the crafts to maximize XP given the artifacts in an inventory.
 */
export function optimizeCrafts(highs: Highs, inventory: Inventory): Solution {
    const problem = getProblem(inventory)
    console.log(problem)
    return {} as Solution
}

/**
 * Generates a linear program problem in CPLEX format.
 */
function getProblem(inventory: Inventory): string {
    const lines = []
    const artifacts = Object.keys(recipes)

    // Generate the maximum XP objective
    lines.push("Maximize")
    lines.push(`  obj: ${getObjective(recipes)}`)

    return lines.join("\n")
}

/**
 * Generates the XP maximization objective for a recipe list.
 */
function getObjective(recipes: Recipes): string {
    const crafts = []
    for (const artifact in recipes) {
        if (!recipes[artifact]) {
            continue
        }
        crafts.push(`${recipes[artifact].xp} ${artifact}`)
    }
    return crafts.join(" + ")
}