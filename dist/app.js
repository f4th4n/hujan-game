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

var model = {
	data: {
		bg: null, // cc.Node
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
	printBg: function () {
		const bg = new cc.Sprite(resource.img.bg)
		bg.setAnchorPoint(0, 0)
		bg.scaleX = 20
		model.data.bg = bg
		this.addChild(bg, helper.zOrder.low)
	},
})

const LayersPlayLevel = cc.Layer.extend({
	plants: [],
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
		cloud.setPosition((50 / 100) * cc.director.getWinSize().width, (80 / 100) * cc.director.getWinSize().height)
		cloud.setScale(0.2)
		this.addChild(cloud, helper.zOrder.medium)
		window.cloud = cloud
		return cloud
	},
	printRaindrop: function (cloud) {
		const particleRain = cc.ParticleSystem.create(resource.particles.rain)
		particleRain.setPosition(cloud.width / 2, (30 / 100) * cloud.height * -1)
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
	},

	createLayers: function () {
		this.addChild(new layers.play.Bg(), helper.zOrder.low)
		this.addChild(new layers.play.Level(), helper.zOrder.medium)
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
