import { Highs } from "../lib/optimize"
import React, { useEffect, useState } from "react"

/**
 * Loads the global highs solver after the page loads.
 */
export default function useHighs(): Highs | null {
    const [ highs, setHighs ] = useState<Highs | null>(null)

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

    return highs
}