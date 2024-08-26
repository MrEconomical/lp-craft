import { Inventory } from "./api/inventory/route"
import { names } from "../data/names"
import { recipes } from "../data/recipes"

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
    return {} as Solution
}

/**
 * Generates a linear program problem in CPLEX format.
 */
function getProblem(inventory: Inventory): string {
    console.log(names, recipes, inventory)
    return ""
}