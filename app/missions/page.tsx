"use client"

import { Mission, missions } from "../../data/missions"
import useHighs from "../../hooks/use-highs"
import { Highs, Solution, optimizeCrafts } from "../../lib/optimize"
import { JSX, useEffect, useState } from "react"

interface MissionStats {
    ship: string,
    target: string,
    xp: number,
}

/**
 * Computes the expected artifact drops for a mission and the expected XP from
 * crafting all the drops optimally.
 */
function getMissionStats(highs: Highs, mission: Mission): MissionStats {
    // Construct inventory by multiplying rates
    const NUM_SHIPS = 20000
    const inventory = structuredClone(mission.rates)
    for (const artifact in inventory) {
        inventory[artifact] = Math.round(inventory[artifact] * NUM_SHIPS)
    }

    // Calculate optimal XP
    const solution = optimizeCrafts(highs, inventory)
    return {
        ship: mission.ship,
        target: mission.target || "none",
        xp: Math.round(solution.totalXp / NUM_SHIPS),
    }
}

export default function Missions(): JSX.Element {
    const highs = useHighs()
    const [ missionStats, setMissionStats ] = useState<MissionStats[]>([])

    // Compute expected XP per mission
    useEffect(() => {
        if (!highs) {
            return
        }
        const stats = missions.map(m => getMissionStats(highs, m))
        stats.sort((a, b) => b.xp - a.xp)
        setMissionStats(stats)
    }, [highs])

    return (
        <>
            missions
            {JSON.stringify(missionStats)}
        </>
    )
}