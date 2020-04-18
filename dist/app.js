// mode: development|production

const config = {
	mode: 'development',
	debug: false,
}

const data = {
	categories: ['flower', 'wood', 'fruit', 'herb', 'magical'],
	levels: [
		{
			index: 1,
			dropRate: {
				flower: 0.75,
				wood: 0.25,
				fruit: 0,
				herb: 0,
				magical: 0,
			},
		},
		{
			index: 2,
			dropRate: {
				flower: 0.3,
				wood: 0.7,
				fruit: 0,
				herb: 0,
				magical: 0,
			},
		},
		{
			index: 3,
			dropRate: {
				flower: 0.2,
				wood: 0.2,
				fruit: 0.6,
				herb: 0,
				magical: 0,
			},
		},
	],
	plants: {
		lotus: {
			id: 'lotus',
			name: 'Lotus',
			category: 'flower',
			animationMode: 'flip',
		},
		orchid: {
			id: 'orchid',
			name: 'Orchid',
			category: 'flower',
			animationMode: 2,
		},
	},
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

/*
	model.user.plantsCollection: { id: int, count: int }
*/

var model = {
	user: {
		firstTime: true,
		plantsCollection: [],
	},
	local: {
		cloud: {
			scheduleUpdatePos: {
				x: -200,
				on: +new Date(),
			},
		},
		plants: [], // [cc.Node]
	},
	once: {
		// data that changed once
		plantY: -1,
	},
	async initUser() {
		// localStorage.removeItem('user')
		const user = localStorage.getItem('user')
		if (user !== null) {
			this.user = JSON.parse(user)
		}
	},
	setUser(key, value) {
		// TODO validation
		// TODO upload to cloud, e.g facebook
		this.user[key] = value

		// temporary: persist on localStorage
		localStorage.setItem('user', JSON.stringify(this.user))
	},
	getUser(key) {
		// TODO make sure data is synced with vendor
		return this.user[key]
	},
}

const resource = {
	img: {
		bg: 'assets/img/bg.png',
		flower1: 'assets/img/flower_1.png',
		cloud: 'assets/img/cloud.png',
		ground: 'assets/img/ground.png',
		seed: 'assets/img/seed.png',
		fingerPoint1: 'assets/img/finger_point_1.png',
		fingerPoint2: 'assets/img/finger_point_2.png',
		whiteSquare: 'assets/img/white_square.png',
		runtime: {
			level1: [
				'assets/img/plant_flower_lotus_1.png',
				'assets/img/plant_flower_orchid_1.png',
				'assets/img/plant_flower_orchid_2.png',
			],
		},
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
		resource.img.seed,
		resource.fonts.pou,
		resource.particles.rain,
	],
}

class Grow {
	// @return isNewPlant
	update(cloud, layer) {
		this.cloud = cloud
		this.layer = layer
		this.modelCloudX = model.local.cloud.scheduleUpdatePos.x

		const cloudXTolerance = (this.modelCloudX * 10) / 100 // TODO need to fine tune the tolerance
		const cloudRangeX = {
			start: this.modelCloudX - cloudXTolerance,
			end: this.modelCloudX + cloudXTolerance,
		}
		if (cloudRangeX.end < 0) return false

		var plantInRange = false
		for (let plant of model.local.plants) {
			if (plant.x >= cloudRangeX.start && plant.x <= cloudRangeX.end) {
				plant.age += 1
				plantInRange = true
			}
		}

		if (plantInRange) return

		const newPlant = new PrefabPlant('random')
		model.local.plants.push(newPlant)
		this.layer.addChild(newPlant, helper.zOrder.low)
	}
}

const grow = new Grow()

const PrefabSeed = cc.Sprite.extend({
	ctor: function () {
		this._super()
		this.initWithFile(resource.img.seed)
		this.setAnchorPoint(0, 0)
		this.setPosition(200, 0)
		this.setScale(0.2)
		this.setPositionX((60 / 100) * cc.director.getWinSize().width)
	},
	onEnter: function () {},
})

const PrefabPlant = cc.Sprite.extend({
	age: 1,

	SEED_SCALE: 0.2,
	SHOW_SEED_AFTER: 2, // in seconds
	BLOOM_AFTER: 5, // in seconds
	//SHOW_SEED_AFTER: 1, // in seconds
	//BLOOM_AFTER: 2, // in seconds
	mode: 'hidden-seed', // hidden-seed|seed|bloom

	ctor: function (plantKeyArg) {
		this._super()

		this.rowPlant = this.getRowPlant(plantKeyArg)

		this.setScale(this.SEED_SCALE)
		this.setAnchorPoint(0.5, 1)
		this.setPositionX(model.local.cloud.scheduleUpdatePos.x)
		this.setPositionY(model.once.plantY)
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
			} else {
				if (this.doneBloom) return

				this.mode = 'bloom'

				this.setPositionY(model.once.plantY)
				this.setTexture(this.getTexture(1))

				this.setScale(0.35)
				this.zIndex = helper.zOrder.high + 1
				this.setAnchorPoint(0.5, 0)

				this.doneBloom = true
			}
		}, 0.1)
	},
})

const PrefabFingerPointHelper = cc.Sprite.extend({
	flipFlop: true,
	ctor: function () {
		this._super()

		const winSize = cc.director.getWinSize()
		this.initWithFile(resource.img.fingerPoint1)
		this.setPosition(winSize.width / 2, winSize.height / 2)

		this.flipImage()
	},
	flipImage: function () {
		this.schedule(() => {
			if (!model.user.firstTime) {
				this.removeFromParent()
				return
			}

			if (this.flipFlop) {
				this.setTexture(resource.img.fingerPoint2)
			} else {
				this.setTexture(resource.img.fingerPoint1)
			}
			this.flipFlop = !this.flipFlop
		}, 0.7)
	},
})

const layers = {
	play: {
		Bg: null, // cc.Layer
		Level: null, // cc.Layer
	},
}

layers.play.Bg = cc.Layer.extend({
	ctor: function () {
		this._super()
		this.printBg()
	},
	printBg: function () {
		const whiteRect = new cc.Sprite(resource.img.whiteSquare)
		whiteRect.setColor(cc.color.WHITE)
		whiteRect.setScaleX(cc.winSize.width / 100 + 1)
		whiteRect.setScaleY(cc.winSize.height / 100 + 1)
		whiteRect.setAnchorPoint(0, 0)
		this.addChild(whiteRect, helper.zOrder.high)
	},
})

/*
	TODO: put seed after 2s of rain
*/

layers.play.Level = cc.Layer.extend({
	isPrintRaindrop: true,

	ctor: function () {
		this._super()

		this.loadImages()
		this.printLabels()
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
			model.once.plantY = ground.y + ground.height - downToEarth
		})
	},
})

const HomeScene = cc.Scene.extend({
	onEnter: function () {
		this._super()
	},
})

const LevelScene = cc.Scene.extend({
	onEnter: function () {
		this._super()

		this.createLayers()
		this.addListener()
	},
	createLayers: function () {
		this.addChild(new layers.play.Bg(), helper.zOrder.low)
		this.addChild(new layers.play.Level(), helper.zOrder.medium)
	},
	setCloudPos(posX) {
		model.local.cloud.scheduleUpdatePos = {
			x: posX,
			on: +new Date(),
		}

		// mark as firstTime = false
		model.setUser('firstTime', false)
	},
	addListener: function () {
		const listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// when swallow touches is true, then returning 'true' from the onTouchBegan method will swallow the touch event, preventing other listeners from using it
			swallowTouches: true,
			onTouchBegan: (touch, event) => {
				this.setCloudPos(touch.getLocationX(), true)
				return true
			},
			// trigger when moving touch
			//onTouchMoved: (touch, event) => {
			//},
			// process the touch end event
			onTouchEnded: (touch, event) => {
				//this.setCloudPos(touch.getLocationX(), true)
			},
		})

		cc.eventManager.addListener(listener1, this)
	},
})

const CollectionScene = cc.Scene.extend({
	onEnter: function () {
		this._super()
	},
})

const app = {
	startGame: () => {},
}

app.startGame = async () => {
	await model.initUser()

	const onGameStart = async () => {
		// FIX cc.loader.onProgress never called
		cc.loader.onProgress = function (completedCount, totalCount, item) {
			const progress = (100 * completedCount) / totalCount
			console.log('progress', progress)
			if (config.mode === 'production') {
				FBInstant.setLoadingProgress(progress)
			}
		}

		cc.director.setDisplayStats(config.debug)

		if (config.mode === 'production') {
			await FBInstant.initializeAsync()
		}

		// Limit downloading max concurrent task to 2
		if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
			cc.macro.DOWNLOAD_MAX_CONCURRENT = 2
		}

		cc.LoaderScene.preload(
			resource.preload.playScene,
			async function () {
				if (config.mode === 'production') {
					await FBInstant.startGameAsync()
				}

				cc.director.runScene(new LevelScene())
			},
			this
		)
	}

	cc.game.run('gameCanvas', onGameStart)
}

window.onload = app.startGame
