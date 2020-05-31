// If variation is provided, removes just the variation. Otherwise removes whole item.
function removeItemFromList(arr, item) {
  const itemName = item.itemName;
  const variation = item.variation;

  const itemIndex = arr.findIndex((item) => item.item_name === itemName);
  const itemInList = itemIndex > -1;

  if (itemInList) {
    if (variation) {
      const variations = arr[itemIndex].variations;
      const variationIndex = variations.indexOf(variation);
      if (variationIndex > -1) variations.splice(variationIndex, 1);
      if (variations.length === 0) arr.splice(itemIndex, 1);
    } else {
      arr.splice(itemIndex, 1);
    }
  }
}

function addItemToList(arr, item) {
  const itemName = item.itemName;
  const variation = item.variation;
  const category = item.category;
  const variationCount = item.variationCount;

  const itemIndex = arr.findIndex((item) => item.item_name === itemName);
  const itemInList = itemIndex > -1;

  if (itemInList) {
    const variations = arr[itemIndex].variations;
    if (variation && !variations.includes(variation))
      variations.push(variation);
  } else {
    arr.push({
      item_name: itemName,
      category: category,
      variations: variation ? [variation] : [],
      variationCount: variationCount,
    });
  }
}

module.exports.removeItemFromList = removeItemFromList;
module.exports.addItemToList = addItemToList;
