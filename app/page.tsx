"use client"

import { Inventory } from "./api/inventory/route"
import { Recipes, NameTable } from "./api/recipes/route"
import Script from "next/script"
import React, { JSX, useState, useEffect } from "react"

interface Highs {
    solve: (problem: string) => any,
}
interface Solution {
    crafts: {
        [artifact: string]: {
            count: number,
            xp: number,
        },
    }
    totalXp: number,
}

/**
 * Fetches artifact data and runs the linear program solver.
 */
async function optimizeCrafts(highs: Highs, eid: string): Promise<Solution> {
    // Load artifact data
    const [{ recipes, names }, inventory] = await Promise.all([
        fetch("/api/recipes")
            .then(response => response.json())
            .then(data => data as { recipes: Recipes, names: NameTable }),
        fetch(`/api/inventory?eid=${eid}`)
            .then(response => response.json())
            .then(data => data as Inventory),
    ])

    // Construct and solve optimization problem
    const problem = getProblem(recipes, names, inventory)
    console.log(problem)
    const solution = highs.solve(problem)
    console.log("Solution:", solution)

    const result = {
        crafts: {},
        totalXp: solution.ObjectiveValue,
    } as Solution
    for (const artifact in solution.Columns) {
        result.crafts[artifact] = {
            count: solution.Columns[artifact].Primal,
            xp: 0,
        }
    }
    console.log("Result:", result)

    return result
}

/**
 * Generates a linear program problem in CPLEX format.
 */
function getProblem(
    recipes: Recipes,
    names: NameTable,
    inventory: Inventory,
): string {
    const lines = []
    const artifacts = Object.keys(recipes)
    const artifactNames = artifacts.map(id => getName(names, id))

    // Generate the maximum XP objective
    lines.push("Maximize")
    lines.push(`  obj: ${getObjective(recipes, names)}`)

    // Add a resource constraint for each artifact
    lines.push("Subject To")
    for (const id of artifacts) {
        const constraint = getConstraint(recipes, names, inventory, id)
        if (constraint) {
            lines.push(`  c${id}: ${constraint}`)
        }
    }

    // Restrict craft counts to positive numbers
    lines.push("Bounds")
    for (const artifact of artifactNames) {
        lines.push(`  ${artifact} >= 0`)
    }

    // Specify all variables as integers
    lines.push("General")
    lines.push(`  ${artifactNames.join(" ")}`)
    lines.push("End")

    return lines.join("\n")
}

/**
 * Generates the XP maximization objective for a recipe list.
 */
function getObjective(recipes: Recipes, names: NameTable): string {
    const crafts = []
    for (const id in recipes) {
        if (!recipes[id]) {
            continue
        }
        crafts.push(`${recipes[id].xp} ${getName(names, id)}`)
    }
    return crafts.join(" + ")
}

/**
 * Generates a resource constraint inequality for an artifact. The total quantity
 * used in each craft that uses the artifact must be bounded by the inventory count
 * plus the number crafted.
 */
function getConstraint(
    recipes: Recipes,
    names: NameTable,
    inventory: Inventory,
    artifactId: string,
): string | null {
    const used = []
    for (const id in recipes) {
        if (!recipes[id] || !(artifactId in recipes[id].ingredients)) {
            continue
        }
        used.push(`${recipes[id].ingredients[artifactId]} ${getName(names, id)}`)
    }
    if (used.length == 0) {
        return null
    }

    const name = getName(names, artifactId)
    const available = inventory[artifactId] || 0
    if (recipes[artifactId]) {
        return `${used.join(" + ")} - ${name} <= ${available}`
    }
    return `${used.join(" + ")} <= ${available}`
}

/**
 * Converts an artifact ID to a string name.
 */
function getName(names: NameTable, id: string): string {
    return names[id].replaceAll("-", "_")
}

export default function Home(): JSX.Element {
    const [ highs, setHighs ] = useState<Highs | null>(null)
    const [ eid, setEID ] = useState<string>("")
    const [ output, setOutput ] = useState<string>("")

    // Load the highs solver on the client side
    useEffect(() => {
        async function loadHighs() {
            const highs = await (window as any).Module({
                locateFile: file => `https://lovasoa.github.io/highs-js/${file}`,
            }) as Highs
            console.log("Loaded highs module")
            setHighs(highs)
        }
        loadHighs()
    }, [])

    // Load the EID from localstorage
    useEffect(() => {
        if (window.localStorage["eid"]) {
            setEID(window.localStorage["eid"])
        }
    }, [])

    /**
     * Set the input field value to the event value.
     */
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if ((event.nativeEvent as any).inputType === "insertFromPaste") {
            return
        }
        setEID(event.target.value)
    }

    /**
     * Save the EID in local storage and run the optimization.
     */
    async function runOptimize() {
        window.localStorage["eid"] = eid
        const solution = await optimizeCrafts(highs, eid)
        setOutput(JSON.stringify(solution, null, 4))
    }

    return (
        <>
            <Script src="/highs.js" strategy="beforeInteractive"></Script>
            Enter EID:
            <input
                type="text"
                value={eid}
                onChange={handleChange}
                onPaste={event => setEID(event.clipboardData.getData("text"))}
            ></input>
            <button onClick={runOptimize}>Calculate</button>
            <br></br>
            {output}
        </>
    )
}