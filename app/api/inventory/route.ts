import { NextRequest } from "next/server"

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
interface Inventory {
    [artifact: number]: number,
}

/**
 * Gets the inventory associated with an EID.
 */
export async function GET(request: NextRequest): Promise<Response> {
    // Get EID from request query
    const eid = request.nextUrl.searchParams.get("eid")
    if (!eid) {
        return new Response(JSON.stringify({
            error: "no EID provided"
        }), { status: 400 })
    }

    // Get inventory from EID
    try {
        const inventory = await getInventory(eid)
        return new Response(JSON.stringify(inventory), { status: 200 })
    } catch {
        return new Response(JSON.stringify({
            error: "unable to get artifact inventory",
        }), { status: 500 })
    }
}

/**
 * Fetches and parses the artifact inventory associated with an EID.
 */
async function getInventory(eid: string): Promise<Inventory> {
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