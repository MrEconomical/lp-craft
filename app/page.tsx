"use client"

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
    console.log(eid)

    console.log("optimizing")
    console.log(highs)

    const PROBLEM = `Maximize
    obj:
        x1 + 2 x2 + 4 x3 + x4
    Subject To
    c1: - x1 + x2 + x3 + 10 x4 <= 20
    c2: x1 - 4 x2 + x3 <= 30
    c3: x2 - 0.5 x4 = 0
    Bounds
    0 <= x1 <= 40
    2 <= x4 <= 3
    End`
    console.log(highs.solve(PROBLEM))
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