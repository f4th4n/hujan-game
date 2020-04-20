layers.play.Level = cc.Layer.extend({
	CLOUD_SCALE: 0.4,

	isPrintRaindrop: false,

	ctor: function () {
		this._super()

		this.loadImages()
		this.printHelper()
		const cloud = this.printCloud()
		const raindrop = this.printRaindrop(cloud)
		const ground = this.printGround()

		this.scheduleCloud(cloud, raindrop)
		this.scheduleGround(ground) // scheduleOnce, set model.constant.plantY
	},
	loadImages() {
		for (let imageUrl of resource.img.runtime.level1) {
			cc.textureCache.addImageAsync(imageUrl)
		}
	},
	printHelper() {
		if (!model.user.firstTime) return

		const fingerPointHelper = new PrefabFingerPointHelper()
		this.addChild(fingerPointHelper, helper.zOrder.low)
		return fingerPointHelper
	},
	printCloud: function () {
		const cloud = cc.Sprite.create(resource.img.cloud)
		cloud.setAnchorPoint(0.5, 0.5)
		cloud.setScale(this.CLOUD_SCALE)
		cloud.setPosition(-100, (85 / 100) * cc.director.getWinSize().height)
		this.addChild(cloud, helper.zOrder.medium)

		return cloud
	},
	printRaindrop: function (cloud) {
		if (!this.isPrintRaindrop) return
		const particleRain = cc.ParticleSystem.create(resource.particles.rain)
		particleRain.setScale(0.6)
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
		ground.setPosition(-50, 0)
		this.addChild(ground, helper.zOrder.medium)
		return ground
	},

	// ---------------------------------------------------------------------------------------------- schedule
	scheduleCloud: function (cloud, raindrop) {
		// schedule move cloud
		cloud.schedule((lapse) => {
			// lapse is difference of seconds since last update
			const now = +new Date()
			if (now < model.local.cloud.scheduleUpdatePos.on) return

			// flip cloud
			if (model.local.cloud.scheduleUpdatePos.x < cloud.x) {
				cloud.scaleX = 1 * this.CLOUD_SCALE
			} else {
				cloud.scaleX = -1 * this.CLOUD_SCALE
			}

			const time = Math.abs(model.local.cloud.scheduleUpdatePos.x - cloud.x) / 1000
			const timeClamp = time < 0.5 ? 0.5 : time // minimum animate in 500 ms
			const moveTo = cc.moveTo(timeClamp, cc.p(model.local.cloud.scheduleUpdatePos.x, cloud.y))
			const moveToEasing = moveTo.clone().easing(cc.easeBackOut())
			cloud.runAction(cc.sequence(moveToEasing))

			// make schedule stop
			model.local.cloud.scheduleUpdatePos.on = +new Date() * 2
		})

		// schedule grow seeds and plants
		cloud.schedule(() => {
			grow.update(cloud, this)
		}, 1.0)
	},

	scheduleGround: function (ground) {
		ground.scheduleOnce(() => {
			const downToEarth = ground.height * 0.08
			model.once.plantY = ground.y + ground.height - downToEarth
		})
	},
})
