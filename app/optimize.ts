import { names } from "../data/names"
import { recipes } from "../data/recipes"

import { Inventory } from "./api/inventory/route"

interface Highs {
    solve: (problem: string) => any,
}
interface Solution {
    crafts: {
        [artifact: string]: {
            count: number,
            xp: number,
        },
    },
    totalXp: number,
}

/**
 * Generates a linear program problem in CPLEX format.
 */
export function getProblem(inventory: Inventory): string {
    console.log(names, recipes, inventory)
    return ""
}