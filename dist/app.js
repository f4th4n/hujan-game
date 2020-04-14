const config = {
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
	plants: [
		{
			id: 1,
			name: 'Melati',
			category: 'flower',
			bloomInSeconds: 5,
			funFact: '',
		},
		{
			id: 2,
			name: 'Mawar',
			category: 'flower',
			bloomInSeconds: 5,
			funFact: '',
		},
		{
			id: 3,
			name: 'Sepatu',
			category: 'flower',
			bloomInSeconds: 5,
			funFact: '',
		},
		{
			id: 4,
			name: 'Bangkai',
			category: 'flower',
			bloomInSeconds: 5,
			funFact: '',
		},
		{
			id: 5,
			name: 'Tulip',
			category: 'flower',
			bloomInSeconds: 5,
			funFact: '',
		},
	],
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
	model.user.plantsOnGround: { id: int, posX: int }
	model.user.plantsCollection: { id: int, count: int }
*/

var model = {
	user: {
		firstTime: true,
		cloudPosX: -500,
		plantsOnGround: [],
		plantsCollection: [],
	},
	local: {
		cloud: {
			moveDelay: false,
		},
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
	printBg: function () {},
})

/*
	TODO: put seed after 2s of rain
*/

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
		const seed = this.printSeed()
		const plants = this.test()

		this.scheduleCloud(cloud, raindrop)
		this.scheduleGround(ground, [seed, ...plants]) // scheduleOnce
	},
	test() {
		const plant1 = new PrefabPlant('flower_orchid', 2)
		plant1.setPositionX((10 / 100) * cc.director.getWinSize().width)
		plant1.setPositionY((25 / 100) * cc.director.getWinSize().height)
		var flip = false
		window.plant1 = plant1
		setInterval(() => {
			plant1.setTexture(
				flip ? 'assets/img/plant_flower_orchid_1.png' : 'assets/img/plant_flower_orchid_2.png'
			)
			flip = !flip
		}, 3000)
		this.addChild(plant1, helper.zOrder.medium)

		const plant2 = new PrefabPlant('flower_lotus', 'flip')
		plant2.setPositionX((30 / 100) * cc.director.getWinSize().width)
		plant2.setPositionY((25 / 100) * cc.director.getWinSize().height)
		this.addChild(plant2, helper.zOrder.medium)

		return [plant1, plant2]
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
		cloud.setScale(0.4)
		cloud.setPosition(model.user.cloudPosX, (80 / 100) * cc.director.getWinSize().height)
		this.addChild(cloud, helper.zOrder.medium)

		return cloud
	},
	printRaindrop: function (cloud) {
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
	/*
	printPlants: function (ground) {
		const plant = new PrefabPlant()
		ground.addChild(plant, helper.zOrder.low)
		return plant
	},
	*/
	printSeed: function () {
		const seed = new PrefabSeed()
		this.addChild(seed, helper.zOrder.low)
		return seed
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
				const downToEarth = ground.height * 0.08
				node.setPositionY(ground.y + ground.height - downToEarth)
			}
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
	setCloudPos(posX, moveDelay) {
		model.setUser('cloudPosX', posX)
		model.local.cloud.moveDelay = moveDelay

		// mark as firstTime = false
		model.setUser('firstTime', false)
	},
	addListener: function () {
		const listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// when swallow touches is true, then returning 'true' from the onTouchBegan method will swallow the touch event, preventing other listeners from using it
			swallowTouches: true,
			onTouchBegan: (touch, event) => {
				this.setCloudPos(touch.getLocationX(), false)
				return true
			},
			// trigger when moving touch
			onTouchMoved: (touch, event) => {
				this.setCloudPos(touch.getLocationX(), true)
			},
			// process the touch end event
			onTouchEnded: (touch, event) => {
				this.setCloudPos(touch.getLocationX(), false)
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

				cc.director.runScene(new LevelScene())
			},
			this
		)
	}

	cc.game.run('gameCanvas', onGameStart)
}

window.onload = app.startGame
