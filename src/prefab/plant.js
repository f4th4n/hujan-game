const PrefabPlant = cc.Sprite.extend({
	age: 1,

	SEED_SCALE: 0.2,
	SHOW_SEED_AFTER: 2, // in seconds
	BLOOM_AFTER: 5, // in seconds
	//SHOW_SEED_AFTER: 1, // in seconds
	//BLOOM_AFTER: 2, // in seconds
	mode: 'hidden-seed', // hidden-seed|seed|bloom

	ctor: function (plantKeyArg) {
		this._super()

		this.rowPlant = this.getRowPlant(plantKeyArg)

		this.setScale(this.SEED_SCALE)
		this.setAnchorPoint(0.5, 1)
		this.setPositionX(model.local.cloud.scheduleUpdatePos.x)
		this.setPositionY(model.once.plantY)
		this.ageListener()
		this.animate()
	},
	getRowPlant(plantKeyArg) {
		if (plantKeyArg === 'random') {
			const keys = Object.keys(data.plants)
			return data.plants[keys[(keys.length * Math.random()) << 0]]
		} else {
			return data.plants[plantKeyArg]
		}
	},
	getTexture(animationCounter) {
		return `assets/img/plant_${this.rowPlant.category}_${this.rowPlant.id}_${animationCounter}.png`
	},
	animate: function () {
		const animateEvery = 3.0

		var animationCounter = 1
		this.schedule(() => {
			if (this.mode !== 'bloom') return

			if (this.rowPlant.animationMode === 'flip') {
				this.scaleX *= -1
				this.setTexture(this.getTexture(1))
			} else {
				animationCounter++
				if (animationCounter > this.rowPlant.animationMode) {
					animationCounter = 1
				}
				this.setTexture(this.getTexture(animationCounter))
			}
		}, animateEvery)
	},
	doneSeed: false,
	doneBloom: false,
	ageListener: function () {
		this.schedule(() => {
			if (this.age < this.SHOW_SEED_AFTER) {
				this.mode = 'hidden-seed'
			} else if (this.age < this.BLOOM_AFTER) {
				if (this.doneSeed) return

				this.mode = 'seed'
				this.setTexture(resource.img.seed)

				// animate seed
				const y = this.y / 4
				const moveBy = cc.moveBy(1.0, cc.p(0, y))
				const moveByEasing = moveBy.clone().easing(cc.easeBackOut())
				this.runAction(cc.sequence(moveByEasing))

				this.doneSeed = true
			} else {
				if (this.doneBloom) return

				this.mode = 'bloom'

				this.setPositionY(model.once.plantY)
				this.setTexture(this.getTexture(1))

				this.setScale(0.35)
				this.zIndex = helper.zOrder.high + 1
				this.setAnchorPoint(0.5, 0)

				this.doneBloom = true
			}
		}, 0.1)
	},
})
