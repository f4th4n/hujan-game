const PrefabPlant = cc.Sprite.extend({
	ctor: function (resourceName, animationMode = null) {
		this._super()

		this.resourceName = resourceName
		this.animationMode = animationMode
		this.initWithFile(`assets/img/plant_${resourceName}_1.png`)
		this.setAnchorPoint(0.5, 0)
		this.setScale(0.35)

		this.createSchedule()
	},
	onEnter: function () {
		const animateEvery = 3000
		if (this.animationMode === 'flip') {
			setInterval(() => (this.scaleX *= -1), animateEvery)
		} else {
			// if animationMode is integer then it's for prefix
			var animationCounter = 1
			setInterval(() => {
				animationCounter++

				if (animationCounter > this.animationMode) {
					animationCounter = 1
				}
				this.setTexture(`assets/img/plant_${this.resourceName}_${animationCounter}.png`)
			}, animateEvery)
		}
	},
	createSchedule() {
		const animateEvery = 0.2
		this.scheduleOnce(() => {
			console.log('s')
		})
	},
})
