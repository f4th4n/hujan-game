layers.play.Level = cc.Layer.extend({
	seeds: [], // TODO
	plants: [], // TODO

	ctor: function () {
		this._super()
		this.printLabels()
		this.printHelper()
		const cloud = this.printCloud()
		const raindrop = this.printRaindrop(cloud)
		const ground = this.printGround()
		//const flower = this.printPlants(ground)
		//const seed = this.printSeed()

		this.scheduleCloud(cloud, raindrop)
		this.scheduleGround(ground, []) // scheduleOnce
	},
	printHelper() {
		if (!model.user.firstTime) return

		const fingerPointHelper = new PrefabFingerPointHelper()
		this.addChild(fingerPointHelper, helper.zOrder.low)
		return fingerPointHelper
	},
	printCloud: function () {
		const cloud = cc.Sprite.create(resource.img.cloud)
		cloud.setAnchorPoint(0, 0)
		cloud.setScale(0.2)
		cloud.setPosition(model.user.cloudPosX, (80 / 100) * cc.director.getWinSize().height)
		this.addChild(cloud, helper.zOrder.medium)

		return cloud
	},
	printRaindrop: function (cloud) {
		const particleRain = cc.ParticleSystem.create(resource.particles.rain)
		particleRain.setPosition(cloud.width / 2, (35 / 100) * cloud.height * -1)
		particleRain.setAnchorPoint(0, 0)
		particleRain.setDrawMode(cc.ParticleSystem.TEXTURE_MODE)
		particleRain.setBlendFunc(cc.BlendFunc.ALPHA_PREMULTIPLIED)
		cloud.addChild(particleRain, helper.zOrder.low)
		return particleRain
	},
	printGround: function () {
		const ground = new cc.Sprite(resource.img.ground)
		ground.setAnchorPoint(0, 0)
		ground.setPosition(0, 0)
		this.addChild(ground, helper.zOrder.medium)
		return ground
	},
	/*
	printPlants: function (ground) {
		const plant = new PrefabPlant()
		ground.addChild(plant, helper.zOrder.low)
		return plant
	},
	printSeed: function () {
		const seed = new PrefabSeed()
		this.addChild(seed, helper.zOrder.low)
		return seed
	},
	*/
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

	// ---------------------------------------------------------------------------------------------- schedule

	isCloudMoving: false,
	lastTimeCloudAnimated: +new Date(),
	scheduleCloud: function (cloud, raindrop) {
		cloud.schedule(() => {
			const delay = 100
			if (this.isCloudMoving) return

			const timeLapse = +new Date() - this.lastTimeCloudAnimated
			if (timeLapse < delay && model.local.cloud.moveDelay) return // throttle for smoother animation

			this.isCloudMoving = true
			const time = Math.abs(model.user.cloudPosX - cloud.x) / 1000
			const timeClamp = time < 0.5 ? 0.5 : time // minimum animate in 500 ms
			const moveTo = cc.moveTo(timeClamp, cc.p(model.user.cloudPosX, cloud.y))
			const moveToEasing = moveTo.clone().easing(cc.easeBackOut())

			const callback = new cc.CallFunc(() => {
				this.isCloudMoving = false
				this.lastTimeCloudAnimated = +new Date()
			})
			cloud.runAction(cc.sequence(moveToEasing, callback))
		})
	},

	scheduleGround: function (ground, nodesOnGround) {
		ground.scheduleOnce(() => {
			for (let node of nodesOnGround) {
				node.setPositionY(ground.y + ground.height)
			}
		})
	},
})
