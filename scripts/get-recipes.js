/**
 * Fetches artifact crafting data and generates a table of recipes. Also creates
 * a mapping from hashed artifact IDs to readable string names.
 */

(async () => {

// Get artifact crafting data from wasmegg GitHub
const RECIPES_URL = "https://raw.githubusercontent.com/carpetsage/egg/main/wasmegg/_common/eiafx/eiafx-data.json"
const recipeData = await fetch(RECIPES_URL).then(response => response.json())
const artifacts = recipeData.artifact_families.flatMap(family => family.tiers)

console.log(artifacts)

const recipes = {}
const names = {}

})()