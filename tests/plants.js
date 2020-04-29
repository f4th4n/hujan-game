// paste this script to console

// config
var level = 1

var x = 0
const plantsFilteredByLevel = data.plants.filter((plant) => plant.level === level)
for (let rowPlant of plantsFilteredByLevel) {
  const nodePlant = new PrefabPlant(rowPlant)
  model.layers.level.level.addChild(nodePlant, helper.zOrder.high)
  const distance = helper.virtual.width * 0.1
  x = x + distance
  nodePlant.setPositionX(x)
}
