class Grow {
	// @return isNewPlant
	update(cloud, layer) {
		this.cloud = cloud
		this.layer = layer
		this.modelCloudX = model.local.cloud.scheduleUpdatePos.x

		const cloudHalfX = this.cloud.width / 2
		const cloudXTolerance = (this.modelCloudX * 10) / 100 // TODO need to fine tune the tolerance
		const cloudX1 = parseInt(this.modelCloudX - cloudHalfX + cloudXTolerance)
		const cloudX2 = parseInt(this.modelCloudX + cloudHalfX - cloudXTolerance)
		const cloudRangeX = {
			start: cloudX1 < cloudX2 ? cloudX1 : cloudX2,
			end: cloudX1 < cloudX2 ? cloudX2 : cloudX1,
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

		const newPlant = new PrefabPlant('random')
		model.local.plants.push(newPlant)
		this.layer.addChild(newPlant, helper.zOrder.high)
	}
}

const grow = new Grow()
