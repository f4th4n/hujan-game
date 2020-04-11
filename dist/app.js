const config = {
	debug: false,
}

const helper = {
	virtual: {
		width: 480,
		height: 270,
	},
	zOrder: {
		zero: 0,
		low: 1,
		medium: 5,
		high: 10,
	},
	insideFBIframe: () => {
		try {
			return window.self !== window.top
		} catch (e) {
			return true
		}
	},
}

const event = new Event('model')

var model = {
	data: {
		cloud: {
			posX: 0,
			moveDelay: false,
			animating: true,
		},
	},
}

const resource = {
	img: {
		bg: 'assets/img/bg.png',
		flower1: 'assets/img/flower_1.png',
		cloud: 'assets/img/cloud.png',
		ground: 'assets/img/ground.png',
	},
	fonts: {
		pou: { type: 'font', name: 'Pou', srcs: ['dist/fonts/Pou-RMR6.ttf'] },
	},
	particles: {
		rain: 'assets/particle_rain.plist',
	},
	preload: {},
}

resource.preload = {
	homeScene: [],
	playScene: [
		resource.img.bg,
		resource.img.flower1,
		resource.img.cloud,
		resource.img.ground,
		resource.fonts.pou,
		resource.particles.rain,
	],
}

const LayersPlayBg = cc.Layer.extend({
	ctor: function () {
		this._super()
		this.printBg()
	},
	printBg: function () {},
})

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

const layers = {
	play: {
		Bg: LayersPlayBg,
		Level: LayersPlayLevel,
	},
}

const HomeScene = cc.Scene.extend({
	onEnter: function () {
		this._super()
	},
})

const PlayScene = cc.Scene.extend({
	onEnter: function () {
		this._super()

		this.createLayers()
		this.addListener()
	},
	createLayers: function () {
		this.addChild(new layers.play.Bg(), helper.zOrder.low)
		this.addChild(new layers.play.Level(), helper.zOrder.medium)
	},
	addListener: function () {
		const listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When swallow touches is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				model.data.cloud.posX = touch.getLocationX()
				model.data.cloud.moveDelay = false
				model.data.cloud.animating = true
				return true
			},
			// trigger when moving touch
			onTouchMoved: function (touch, event) {
				model.data.cloud.posX = touch.getLocationX()
				model.data.cloud.moveDelay = true
				model.data.cloud.animating = true
			},
			// process the touch end event
			//onTouchEnded: function (touch, event) {
			//},
		})

		cc.eventManager.addListener(listener1, this)
	},
})

const app = {
	startGame: () => {},
}

app.startGame = () => {
	const onGameStart = async () => {
		// FIX cc.loader.onProgress never called
		cc.loader.onProgress = function (completedCount, totalCount, item) {
			const progress = (100 * completedCount) / totalCount
			console.log('progress', progress)
			if (helper.insideFBIframe()) {
				FBInstant.setLoadingProgress(progress)
			}
		}

		cc.director.setDisplayStats(config.debug)

		if (helper.insideFBIframe()) {
			await FBInstant.initializeAsync()
		}

		if (cc.sys.isMobile) {
			cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
		}

		// Limit downloading max concurrent task to 2
		if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
			cc.macro.DOWNLOAD_MAX_CONCURRENT = 2
		}

		cc.LoaderScene.preload(
			resource.preload.playScene,
			async function () {
				if (helper.insideFBIframe()) {
					await FBInstant.startGameAsync()
				}

				cc.director.runScene(new PlayScene())
			},
			this
		)
	}

	cc.game.run('gameCanvas', onGameStart)
}

window.onload = app.startGame
