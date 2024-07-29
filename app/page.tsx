"use client"

import Script from "next/script"
import { JSX, useState, useEffect } from "react"

async function optimizeCrafts(highs: any) {
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
    const [ highs, setHighs ] = useState(null)

    // Load the highs solver on the client side
    useEffect(() => {
        async function loadHighs() {
            const highs = await (window as any).Module()
            console.log("Loaded highs module")
            setHighs(highs)
        }
        loadHighs()
    }, [])

    return (
        <>
            <Script
                src="https://lovasoa.github.io/highs-js/highs.js"
                strategy="beforeInteractive"
            ></Script>
            {!highs ? "no highs" : "highs"}
            <button onClick={() => optimizeCrafts(highs)}>Calculate</button>
        </>
    )
}