/**
 * Fetches artifact crafting data and generates a table of recipes. Also creates
 * a mapping from hashed artifact IDs to readable string names.
 */

const fs = require("fs")

;(async () => {

// Get artifact crafting data from wasmegg GitHub
const RECIPES_URL = "https://raw.githubusercontent.com/carpetsage/egg/main/wasmegg/_common/eiafx/eiafx-data.json"
const recipeData = await fetch(RECIPES_URL).then(response => response.json())
const artifacts = recipeData.artifact_families.flatMap(family => family.tiers)

// Compute a mapping from artifact IDs to names
const names = {}
const keys = []
for (const artifact of artifacts) {
    const key = hashArtifact(artifact)
    names[key] = formatName(artifact.id)
    keys.push(key)
}
keys.sort((a, b) => names[a] < names[b] ? -1 : 1)

// Save artifact data to JSON files
const NAMES_FILE = "data/names.json"
const RECIPES_FILE = "data/recipes.json"
fs.writeFileSync(NAMES_FILE, JSON.stringify(names, keys, 4))

/**
 * Computes a unique numerical hash for an artifact.
 */
function hashArtifact(artifact) {
    const MAX_LEVEL = 3
    return artifact.afx_id * (MAX_LEVEL + 1) + artifact.afx_level
}

/**
 * Converts an artifact name into a standard format.
 */
function formatName(name) {
    return name.replaceAll("-", "_")
}

})()