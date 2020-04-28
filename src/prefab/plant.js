const PrefabPlant = cc.Sprite.extend({
	SEED_SCALE: 0.2,
	PLANT_SCALE: 0.4,
	SHOW_SEED_AFTER: 2, // in seconds
	BLOOM_AFTER: 5, // in seconds
	ANIMATE_EVERY: 3.0, // in seconds
	DESTROY_AFTER: 20,

	age: 1,
	mode: 'hidden-seed', // hidden-seed|seed|bloom
	isAd: false,

	ctor: function () {
		this._super()

		this.rowPlant = this.getRowPlant()

		this.setScale(this.SEED_SCALE)
		this.setAnchorPoint(0.5, 0.5)
		this.setPositionX(model.local.cloud.scheduleUpdatePos.x)
		this.setPositionY(model.once.plantY)
		this.ageListener()
		this.animate()
		window.plant = this
	},
	getRowPlant() {
		if (
			model.local.plantsCountCurrentSession % config.ad.showEveryPlant === 0 &&
			model.local.plantsCountCurrentSession !== 0
		) {
			this.isAd = true
			return { id: 'ad', name: 'Ad', category: 'etc' }
		}

		/*
			This function will return random plant based on user's level.
			Level 1 will return plant level 1,
			Level 2 will return plant level 1, level 2
			Level 3 will return plant level 1, level 2, level 3
			Etc
		*/
		const plantsFilteredByLevel = data.plants.filter((plant) => plant.level <= model.user.level)
		const plant = plantsFilteredByLevel[Math.floor(Math.random() * plantsFilteredByLevel.length)]
		return plant
	},
	getTexture(animationCounter) {
		return `assets/img/plant_${this.rowPlant.category}_${this.rowPlant.id}_${animationCounter}.png`
	},
	animate: function () {
		if (this.isAd) return

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
		}, this.ANIMATE_EVERY)
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
			} else if (this.age < this.DESTROY_AFTER) {
				if (this.doneBloom) return

				this.mode = 'bloom'

				if (this.isAd) {
					this.setTexture(resource.img.newspaper)
					this.setScale(0.3)
					this.showAndRequestAd()
				} else {
					this.setPositionY(model.once.plantY)
					this.setTexture(this.getTexture(1))
					this.setScale(this.PLANT_SCALE)
					// update data
					model.setUser('plantsCollection', [...model.user.plantsCollection, this.rowPlant.id])
					model.local.plantsCountCurrentSession++
				}

				this.zIndex = helper.zOrder.high + 1
				this.setAnchorPoint(0.5, 0)

				this.doneBloom = true
			} else {
				this.removeFromParent()
			}
		}, 0.1)
	},
	showAndRequestAd() {
		setTimeout(() => {
			this.removeFromParent()

			if (!app.preloadedInterstitial) return

			app.preloadedInterstitial
				.showAsync()
				.then(function () {
					console.log('Interstitial ad finished successfully')
					app.requestAd()
				})
				.catch(function (e) {
					console.error(e.message)
				})
		}, 1500)
	},
})
