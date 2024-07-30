"use client"

import { Inventory } from "./api/inventory/route"
import { Recipes, NameTable } from "./api/recipes/route"
import Script from "next/script"
import React, { JSX, useState, useEffect } from "react"

interface Highs {
    solve: (problem: string) => any,
}

/**
 * Fetches artifact data and runs the linear program solver.
 */
async function optimizeCrafts(highs: Highs, eid: string) {
    // Load artifact data
    const [ { recipes, names }, inventory ] = await Promise.all([
        fetch("/api/recipes")
            .then(response => response.json())
            .then(data => data as { recipes: Recipes, names: NameTable }),
        fetch(`/api/inventory?eid=${eid}`)
            .then(response => response.json())
            .then(data => data as Inventory),
    ])

    // Construct and solve optimization problem
    const problem = createProblem(recipes, names, inventory)
    console.log(problem)
    console.log(highs.solve(problem))
}

/**
 * Generates a linear program problem in CPLEX format.
 */
function createProblem(
    recipes: Recipes,
    names: NameTable,
    inventory: Inventory,
): string {
    const lines = []
    const artifacts = Object.keys(recipes)
    const artifactNames = artifacts.map(id => getName(names, id))

    // Maximum XP objective
    lines.push("Maximize")
    lines.push(`  obj: ${createObjective(recipes, names)}`)

    // Restrict craft counts to positive numbers
    lines.push("Bounds")
    for (const artifact of artifactNames) {
        lines.push(`  0 <= ${artifact}`)
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
function createObjective(recipes: Recipes, names: NameTable): string {
    const crafts = []
    for (const artifactId in recipes) {
        if (!recipes[artifactId]) {
            continue
        }
        crafts.push(`${recipes[artifactId].xp} ${getName(names, artifactId)}`)
    }
    return crafts.join(" + ")
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
    function runOptimize() {
        window.localStorage["eid"] = eid
        optimizeCrafts(highs, eid)
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
        </>
    )
}