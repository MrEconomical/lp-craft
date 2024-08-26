"use client"

import { Inventory } from "./api/inventory/route"
import useHighs from "../hooks/use-highs"
import { Highs, Solution, optimizeCrafts } from "../lib/optimize"
import React, { JSX, useState, useEffect } from "react"

/**
 * Fetches artifact data and runs the linear program solver.
 */
async function getOptimalCrafts(highs: Highs, eid: string): Promise<Solution> {
    const inventory = await fetch(`/api/inventory?eid=${eid}`)
        .then(response => response.json())
        .then(data => data as Inventory)
    return optimizeCrafts(highs, inventory)
}

export default function Home(): JSX.Element {
    const highs = useHighs()
    const [ eid, setEID ] = useState<string>("")
    const [ solution, setSolution ] = useState<Solution | null>(null)

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
        if (!highs) {
            return
        }
        window.localStorage["eid"] = eid
        const result = await getOptimalCrafts(highs, eid)
        setSolution(result)
    }

    return (
        <>
            Enter EID:
            <input
                type="text"
                value={eid}
                onChange={handleChange}
                onPaste={event => setEID(event.clipboardData.getData("text"))}
            ></input>
            <button onClick={runOptimize}>Calculate</button>
            {solution ? (
                <>
                    <div>Total XP: {solution.totalXp}</div>
                    {Object.keys(solution.crafts).sort().map(artifact => (
                        <div key={artifact}>
                            {artifact}: {solution.crafts[artifact].count} ({solution.crafts[artifact].xp} xp)
                        </div>
                    ))}
                </>
            ) : (<></>)}
        </>
    )
}