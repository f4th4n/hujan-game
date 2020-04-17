/*
	TODO: put seed after 2s of rain
*/

layers.play.Level = cc.Layer.extend({
	isPrintRaindrop: true,
	seeds: [], // TODO
	plants: [], // TODO

	ctor: function () {
		this._super()
		this.printLabels()
		this.printHelper()
		const cloud = this.printCloud()
		const raindrop = this.printRaindrop(cloud)
		const ground = this.printGround()

		this.scheduleCloud(cloud, raindrop)
		this.scheduleGround(ground) // scheduleOnce, set model.constant.plantY
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
		cloud.setScale(0.4)
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
	scheduleCloud: function (cloud, raindrop) {
		// schedule move cloud
		cloud.schedule((lapse) => {
			// lapse is difference of seconds since last update
			const now = +new Date()
			if (now < model.local.cloud.scheduleUpdatePos.on) return

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
			model.constant.plantY = ground.y + ground.height - downToEarth
		})
	},
})
