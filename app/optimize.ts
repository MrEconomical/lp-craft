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
    // Generate the maximum XP objective
    const lines = []
    lines.push("Maximize")
    lines.push(`  obj: ${getObjective(recipes)}`)

    // Add a resource constraint for each artifact
    lines.push("Subject To")
    for (const artifact in recipes) {
        const constraint = getConstraint(recipes, inventory, artifact)
        if (constraint) {
            lines.push(`  c_${artifact}: ${constraint}`)
        }
    }

    // Restrict craft counts to positive numbers
    lines.push("Bounds")
    for (const artifact in recipes) {
        lines.push(`  ${artifact} >= 0`)
    }

    // Specify all variables as integers
    lines.push("General")
    lines.push(`  ${Object.keys(recipes).join(" ")}`)
    lines.push("End")

    return lines.join("\n")
}

/**
 * Generates the XP maximization objective for a recipe list.
 */
function getObjective(recipes: Recipes): string {
    const crafts = []
    for (const artifact in recipes) {
        if (recipes[artifact]) {
            crafts.push(`${recipes[artifact].xp} ${artifact}`)
        }
    }
    return crafts.join(" + ")
}

/**
 * Generates a resource constraint inequality for an artifact. The total quantity
 * used in each craft that uses the artifact must be bounded by the inventory count
 * plus the number crafted.
 */
function getConstraint(recipes: Recipes, inventory: Inventory, artifact: string): string | null {
    const used = []
    for (const parent in recipes) {
        if (recipes[parent] && artifact in recipes[parent].ingredients) {
            used.push(`${recipes[parent].ingredients[artifact]} ${parent}`)
        }
    }
    if (used.length == 0) {
        return null
    }

    const available = inventory[artifact] || 0
    if (recipes[artifact]) {
        return `${used.join(" + ")} - ${artifact} <= ${available}`
    }
    return `${used.join(" + ")} <= ${available}`
}