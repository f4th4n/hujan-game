const LayersPlayLevel = cc.Layer.extend({
	plants: [], // TODO
	isCloudMoving: false,
	lastTimeCloudAnimated: +new Date(),

	ctor: function () {
		this._super()
		const cloud = this.printCloud()
		this.printRaindrop(cloud)
		this.printPlants()
		this.printLabels()
	},
	printCloud: function () {
		const cloud = cc.Sprite.create(resource.img.cloud)
		cloud.setAnchorPoint(0, 0)
		cloud.setScale(0.2)
		cloud.setPosition(model.data.cloudPosX, (80 / 100) * cc.director.getWinSize().height)
		this.addChild(cloud, helper.zOrder.medium)
		cloud.schedule(() => {
			const delay = 150
			if (this.isCloudMoving) return
			if (+new Date() - this.lastTimeCloudAnimated < delay) return

			this.isCloudMoving = true
			const time = Math.abs(model.data.cloudPosX - cloud.x) / 1000
			const timeClamp = time < 0.5 ? 0.5 : time // minimum animate in 500 ms
			const moveTo = cc.moveTo(timeClamp, cc.p(model.data.cloudPosX, cloud.y)).clone().easing(cc.easeBackOut())

			const callback = new cc.CallFunc(() => {
				this.isCloudMoving = false
				this.lastTimeCloudAnimated = +new Date()
			})
			cloud.runAction(cc.sequence(moveTo, callback))
		})

		return cloud
	},
	printRaindrop: function (cloud) {
		const particleRain = cc.ParticleSystem.create(resource.particles.rain)
		particleRain.setPosition(cloud.width / 2, (35 / 100) * cloud.height * -1)
		particleRain.setAnchorPoint(0, 0)
		particleRain.setDrawMode(cc.ParticleSystem.TEXTURE_MODE)
		particleRain.setBlendFunc(cc.BlendFunc.ALPHA_PREMULTIPLIED)
		//particleRain.scale = 0.15
		window.particleRain = particleRain
		cloud.addChild(particleRain, helper.zOrder.low)
	},
	printPlants: function () {
		if (model.data.bg.height === 0) return setTimeout(() => this.printPlants(), 5)

		const flower = cc.Sprite.create(resource.img.flower1)
		flower.setAnchorPoint(0, 0)
		flower.setPosition((10 / 100) * cc.director.getWinSize().width, model.data.bg.y + model.data.bg.height)
		flower.setScale(0.2)
		this.addChild(flower, helper.zOrder.medium)
	},
	printLabels: function () {
		const label = cc.LabelTTF.create('Hujan', resource.fonts.pou.name, 24)
		label.setPosition(
			(1 / 100) * cc.director.getWinSize().width,
			cc.director.getWinSize().height - (1 / 100) * cc.director.getWinSize().height
		)
		label.setColor('black')
		label.setAnchorPoint(0, 1)
		this.addChild(label, helper.zOrder.medium)
	},
})
