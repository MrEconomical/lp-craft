import { Recipes } from "../recipes/route"

interface Artifact {
    artifactType: {
        id: number,
    }
    artifactRarity: {
        name: string,
    }
    artifactLevel: {
        id: number,
    }
    quantity: number,
}

export interface Inventory {
    [artifact: number]: number,
}
export interface Crafts {
    crafts: {
        [artifact: number]: {
            count: number,
            xp: number,
        },
    },
    total_xp: number,
}

/**
 * Fetches and parses the artifact inventory associated with an EID.
 */
export async function getArtifacts(eid: string): Promise<Inventory> {
    const INVENTORY_URL = "https://eggincdatacollection.azurewebsites.net/api/GetInventoryJson"
    const artifacts = await fetch(
        `${INVENTORY_URL}?eid=${eid}`,
        { cache: "no-store" },
    ).then(response => response.json()) as Artifact[]

    const inventory: Inventory = {}
    for (const artifact of artifacts) {
        if (artifact.artifactRarity.name != "COMMON") {
            continue
        }
        const key = hashArtifact(artifact)
        inventory[key] = artifact.quantity
    }

    return inventory
}

/**
 * Computes a unique numerical hash for an artifact.
 */
function hashArtifact(artifact: Artifact): number {
    const MAX_LEVEL = 3
    return artifact.artifactType.id * (MAX_LEVEL + 1) + artifact.artifactLevel.id
}

/**
 * Computes the optimal amount of each artifact to craft.
 */
export function optimizeCrafts(
    recipes: Recipes,
    artifacts: Inventory,
): Crafts {
    return {} as Crafts
}