const LayersPlayLevel = cc.Layer.extend({
	plants: [], // TODO
	isCloudMoving: false,
	lastTimeCloudAnimated: +new Date(),

	ctor: function () {
		this._super()
		const cloud = this.printCloud()
		this.printRaindrop(cloud)
		const ground = this.printGround()
		this.printPlants(ground)
		this.printLabels()
	},
	printCloud: function () {
		const cloud = cc.Sprite.create(resource.img.cloud)
		cloud.setAnchorPoint(0, 0)
		cloud.setScale(0.2)
		cloud.setPosition(model.data.cloud.posX, (80 / 100) * cc.director.getWinSize().height)
		this.addChild(cloud, helper.zOrder.medium)

		cloud.schedule(() => {
			const delay = 100
			if (!model.data.cloud.animating) return
			if (this.isCloudMoving) return

			const timeLapse = +new Date() - this.lastTimeCloudAnimated
			if (timeLapse < delay && model.data.cloud.moveDelay) return // throttle for smoother animation

			this.isCloudMoving = true
			const time = Math.abs(model.data.cloud.posX - cloud.x) / 1000
			const timeClamp = time < 0.5 ? 0.5 : time // minimum animate in 500 ms
			const moveTo = cc.moveTo(timeClamp, cc.p(model.data.cloud.posX, cloud.y))
			const moveToEasing = moveTo.clone().easing(cc.easeBackOut())

			const callback = new cc.CallFunc(() => {
				this.isCloudMoving = false
				this.lastTimeCloudAnimated = +new Date()
				model.data.cloud.animating = false
			})
			cloud.runAction(cc.sequence(moveToEasing, callback))
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
		cloud.addChild(particleRain, helper.zOrder.low)
	},
	printGround: function () {
		const ground = new cc.Sprite(resource.img.ground)
		ground.setAnchorPoint(0, 0)
		ground.scaleX = 20
		this.addChild(ground, helper.zOrder.medium + 1)
		return ground
	},
	printPlants: function (ground) {
		if (ground.height === 0) return setTimeout(() => this.printPlants(ground), 5)

		const flower = cc.Sprite.create(resource.img.flower1)
		flower.setAnchorPoint(0, 0)
		flower.setPosition((10 / 100) * cc.director.getWinSize().width, ground.y + ground.height)
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
