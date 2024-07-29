"use client"

import Script from "next/script"
import { JSX, useState, useEffect } from "react"

export default function Home(): JSX.Element {
    const [ highs, setHighs ] = useState(null)

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
        </>
    )
}