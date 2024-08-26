/**
 * Exports an array of ship target drop statistics.
 */

import missionData from "./missions.json"

export interface Mission {
    ship: string,
    target: string | null,
    rates: Record<string, number>,
}

export const missions = missionData as Mission[]