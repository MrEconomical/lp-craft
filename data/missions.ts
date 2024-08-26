/**
 * Exports an array of ship target drop statistics.
 */

export interface Mission {
    ship: string,
    target: string | null,
    rates: Record<string, number>,
}