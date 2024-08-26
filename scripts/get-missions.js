/**
 * Fetches mission drop data and generates an array of statistics.
 */

const fs = require("fs")

;(async () => {

// Analyze atreggies extended targets with at least 10,000 drops
const SHIP_NUM = 10
const SHIP_DURATION = 2
const SHIP_LEVEL = 5
const MIN_DROPS = 10000
const BASE_NAME = "atreggies_extended"

// Get atreggies extended and artifact data from wasmegg GitHub
const LOOT_URL = "https://raw.githubusercontent.com/carpetsage/egg/main/wasmegg/artifact-explorer/src/lib/loot.json"
const ARTIFACT_URL = "https://github.com/carpetsage/egg/raw/main/wasmegg/_common/eiafx/eiafx-data.json"
const [ ships, artifactFamilies ] = await Promise.all([
    fetch(LOOT_URL)
        .then(response => response.json())
        .then(data => data.missions),
    fetch(ARTIFACT_URL)
        .then(response => response.json())
        .then(data => data.artifact_families)
])

// Filter missions by ship and target
const atreggies = ships.find(ship => ship.afxShip == SHIP_NUM && ship.afxDurationType == SHIP_DURATION)
const targets = atreggies.levels
    .find(star => star.level == SHIP_LEVEL).targets
    .filter(target => target.totalDrops >= MIN_DROPS)

// Create artifact ID to name map and list of all artifacts
const names = {}
const artifacts = []
for (const family of artifactFamilies) {
    names[family.afx_id] = formatName(family.id)
    for (const tier of family.tiers) {
        artifacts.push(formatName(tier.id))
    }
}
names[10000] = null

// Create array of target statistics
const stats = []
for (const target of targets) {
    const rates = {}
    for (const artifact of artifacts) {
        rates[artifact] = 0
    }
    for (const item of target.items) {
        const name = formatName(item.itemId)
        rates[name] = item.counts.reduce((a, b) => a + b)
    }
    for (const artifact in rates) {
        rates[artifact] /= target.totalDrops
    }

    stats.push({
        ship: BASE_NAME,
        target: names[target.targetAfxId],
        rates,
    })
}

// Save mission data to JSON file
const MISSIONS_FILE = "data/missions.json"
fs.writeFileSync(MISSIONS_FILE, JSON.stringify(stats, null, 4))

/**
 * Converts an artifact name into a standard format.
 */
function formatName(name) {
    return name.replaceAll("-", "_")
}

})()