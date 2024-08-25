export interface Recipes {
    [artifact: string]: {
        ingredients: Record<string, number>,
        xp: number,
    } | null,
}