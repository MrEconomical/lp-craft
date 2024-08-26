import { Inventory } from "../app/api/inventory/route"
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
    // Run the highs solver on the LP problem
    const problem = getProblem(inventory)
    console.log(problem)
    const solution = highs.solve(problem)
    console.log("Solution:", solution)

    // Store each craft and recompute the total XP
    const result = {
        crafts: {},
        totalXp: 0,
    } as Solution
    for (const artifact in solution.Columns) {
        if (recipes[artifact]) {
            const count = solution.Columns[artifact].Primal
            const xp = count * recipes[artifact].xp
            result.crafts[artifact] = { count, xp }
            result.totalXp += xp
        }
    }

    return result
}

/**
 * Generates a linear program problem in CPLEX format.
 */
function getProblem(inventory: Inventory): string {
    // Sort artifacts for determinism
    const lines = [] as string[]
    const artifacts = Object.keys(recipes).sort()

    // Generate the maximum XP objective
    lines.push("Maximize")
    lines.push(`  obj: ${getObjective(recipes, artifacts)}`)

    // Add a resource constraint for each artifact
    lines.push("Subject To")
    for (const artifact of artifacts) {
        const constraint = getConstraint(recipes, inventory, artifact)
        if (constraint) {
            lines.push(`  c_${artifact}: ${constraint}`)
        }
    }

    // Restrict craft counts to positive numbers
    lines.push("Bounds")
    for (const artifact of artifacts) {
        lines.push(`  ${artifact} >= 0`)
    }

    // Specify all variables as integers
    lines.push("General")
    lines.push(`  ${artifacts.join(" ")}`)
    lines.push("End")

    return lines.join("\n")
}

/**
 * Generates the XP maximization objective for a recipe list.
 */
function getObjective(recipes: Recipes, artifacts: string[]): string {
    const crafts = [] as string[]
    for (const artifact of artifacts) {
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
    const used = [] as string[]
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