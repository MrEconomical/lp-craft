/**
 * Exports a mapping from artifact IDs to names.
 */

import nameTable from "./names.json"

export interface ArtifactNames {
    [id: number]: string,
}

export const names = nameTable as ArtifactNames