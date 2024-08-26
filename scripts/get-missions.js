/**
 * Fetches mission drop data and generates an array of statistics.
 */

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
const [ ships, artifacts ] = await Promise.all([
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

// Create map from artifact IDs to names
const names = {}
for (const family of artifacts) {
    names[family.afx_id] = family.id.replaceAll("-", "_")
}



})()