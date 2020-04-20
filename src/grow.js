class Grow {
	// @return isNewPlant
	update(cloud, layer) {
		this.cloud = cloud
		this.layer = layer
		this.modelCloudX = model.local.cloud.scheduleUpdatePos.x

		const cloudXTolerance = (this.modelCloudX * 10) / 100 // TODO need to fine tune the tolerance
		const cloudRangeX = {
			start: this.modelCloudX - cloudXTolerance,
			end: this.modelCloudX + cloudXTolerance,
		}
		if (cloudRangeX.end < 0) return false

		var plantInRange = false
		for (let plant of model.local.plants) {
			if (plant.x >= cloudRangeX.start && plant.x <= cloudRangeX.end) {
				plant.age += 1
				plantInRange = true
			}
		}

		if (plantInRange) return

		const newPlant = new PrefabPlant()
		model.local.plants.push(newPlant)
		this.layer.addChild(newPlant, helper.zOrder.low)
	}
}

const grow = new Grow()
