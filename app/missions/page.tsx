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
    return {
        ship: mission.ship,
        target: mission.target || "none",
        xp: 0,
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
        stats.sort()
        setMissionStats(stats)
    }, [highs])

    return (
        <>
            missions
            {JSON.stringify(missionStats)}
        </>
    )
}