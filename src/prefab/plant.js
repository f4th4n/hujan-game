const PrefabPlant = cc.Sprite.extend({
	age: 1,

	SEED_SCALE: 0.2,
	SHOW_SEED_AFTER: 2, // in seconds
	BLOOM_AFTER: 5, // in seconds
	mode: 'hidden-seed', // hidden-seed|seed|bloom

	ctor: function (plantKeyArg) {
		this._super()

		this.rowPlant = this.getRowPlant(plantKeyArg)

		this.setScale(this.SEED_SCALE)
		this.setAnchorPoint(0.5, 0)
		this.setPositionX(model.local.cloud.scheduleUpdatePos.x)
		this.setPositionY(model.constant.plantY)
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
	prevAge: 1,
	prevMode: null,
	ageListener: function () {
		this.schedule(() => {
			if (this.prevAge == this.age) return
			if (this.prevMode == this.mode && this.mode === 'bloom') return

			if (this.age < this.SHOW_SEED_AFTER) {
				this.mode = 'hidden-seed'
			} else if (this.age < this.BLOOM_AFTER) {
				this.mode = 'seed'
				this.setTexture(resource.img.seed)
			} else {
				this.mode = 'bloom'
				this.setTexture(this.getTexture(1))

				setTimeout(() => this.setTexture(this.getTexture(1)), 50)
				this.setScale(0.35)
			}

			this.prevAge = this.age
			this.prevMode = this.mode
		}, 0.1)
	},
})
