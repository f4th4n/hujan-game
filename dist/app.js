// mode: development|production

const config = {
  mode: 'development',
  debug: false,
}

const data = {
	categories: ['flower', 'wood', 'fruit', 'herb', 'magical'],
	plants: [
		{
			id: 'lotus',
			name: 'Lotus',
			category: 'flower',
			animationMode: 'flip',
			level: 1,
		},
		{
			id: 'orchid',
			name: 'Orchid',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'lily',
			name: 'Lily',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'plumeria',
			name: 'Plumeria',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'sunflower',
			name: 'Sunflower',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'ffff',
			name: 'ffff',
			category: 'flower',
			animationMode: 2,
			level: 2,
		},
		{
			id: 'ggggg',
			name: 'ggggg',
			category: 'flower',
			animationMode: 2,
			level: 3,
		},
	],
	levels: [
		{
			index: 1,
			plantIds: ['lotus', 'orchid', 'lily', 'plumeria', 'sunflower'],
		},
		{
			index: 2,
		},
		{
			index: 3,
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
	model.user.plantsCollection: { id: int, count: int }
*/

var model = {
	user: {
		firstTime: true,
		plantsCollection: [],
		level: 1,
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
		if (config.mode === 'production') {
			const data = await FBInstant.player.getDataAsync(['firstTime', 'plantsCollection', 'level'])
			if (data.firstTime === false) {
				this.user = { ...this.user, ...data }
			}
		} else {
			// localStorage.removeItem('user')
			const user = localStorage.getItem('user')
			if (user !== null) {
				this.user = JSON.parse(user)
			}
		}
	},
	async setUser(key, value) {
		// TODO validation
		// TODO upload to cloud, e.g facebook
		this.user[key] = value

		if (config.mode === 'production') {
			var data = {}
			data[key] = value
			await FBInstant.player.setDataAsync(data)
		} else {
			// temporary: persist on localStorage
			localStorage.setItem('user', JSON.stringify(this.user))
		}
	},
	getUser(key) {
		// TODO make sure data is synced with vendor
		return this.user[key]
	},
}

const resource = {
	img: {
		bg: 'assets/img/bg.png',
		cloud: 'assets/img/cloud.png',
		ground: 'assets/img/ground.png',
		seed: 'assets/img/seed.png',
		fingerPoint1: 'assets/img/finger_point_1.png',
		fingerPoint2: 'assets/img/finger_point_2.png',
		whiteSquare: 'assets/img/white_square.png',
		runtime: {
			level1: [
				'assets/img/plant_flower_lily_1.png',
				'assets/img/plant_flower_lily_2.png',
				'assets/img/plant_flower_lotus_1.png',
				'assets/img/plant_flower_orchid_1.png',
				'assets/img/plant_flower_orchid_2.png',
				'assets/img/plant_flower_plumeria_1.png',
				'assets/img/plant_flower_plumeria_2.png',
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
		resource.img.cloud,
		resource.img.ground,
		resource.img.seed,
		resource.fonts.pou,
		resource.particles.rain,
	],
}

class Grow {
	update(cloud, layer) {
		this.cloud = cloud
		this.layer = layer
		this.modelCloudX = model.local.cloud.scheduleUpdatePos.x

		const cloudXTolerance = (this.modelCloudX * 10) / 100 // TODO need to fine tune the tolerance
		const cloudRangeX = {
			start: this.modelCloudX - cloudXTolerance,
			end: this.modelCloudX + cloudXTolerance,
		}
		if (cloudRangeX.end < 0) return

		var plantInRange = false
		for (let plant of model.local.plants) {
			if (plant.x >= cloudRangeX.start && plant.x <= cloudRangeX.end) {
				plant.age += 1
				plantInRange = true
			}
		}

		if (plantInRange) return

		const newPlant = new PrefabPlant()
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
	SEED_SCALE: 0.2,
	SHOW_SEED_AFTER: 2, // in seconds
	BLOOM_AFTER: 5, // in seconds
	DESTROY_AFTER: 20,

	age: 1,
	mode: 'hidden-seed', // hidden-seed|seed|bloom

	ctor: function () {
		this._super()

		this.rowPlant = this.getRowPlant()

		this.setScale(this.SEED_SCALE)
		this.setAnchorPoint(0.5, 0.5)
		this.setPositionX(model.local.cloud.scheduleUpdatePos.x)
		this.setPositionY(model.once.plantY)
		this.ageListener()
		this.animate()
		window.plant = this
	},
	getRowPlant() {
		/*
			This function will return random plant based on user's level.
			Level 1 will return plant level 1,
			Level 2 will return plant level 1, level 2
			Level 3 will return plant level 1, level 2, level 3
			Etc
		*/
		const plantsFilteredByLevel = data.plants.filter((plant) => plant.level <= model.user.level)
		const plant = plantsFilteredByLevel[Math.floor(Math.random() * plantsFilteredByLevel.length)]
		return plant
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
			} else if (this.age < this.DESTROY_AFTER) {
				if (this.doneBloom) return

				this.mode = 'bloom'

				this.setPositionY(model.once.plantY)
				this.setTexture(this.getTexture(1))

				this.setScale(0.35)
				this.zIndex = helper.zOrder.high + 1
				this.setAnchorPoint(0.5, 0)

				// update data
				model.setUser('plantsCollection', [...model.user.plantsCollection, this.rowPlant.id])

				this.doneBloom = true
			} else {
				this.removeFromParent()
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
    Sidebar: null, // cc.Layer
  },
}

layers.play.Sidebar = cc.Layer.extend({
  RIGHT_SIDEBAR_OPACITY: 200,

  ctor: function () {
    this._super()

    this.printTitle()

    this.updateSidebarKeys()
    this.schedule(() => {
      this.updateSidebarKeys()
    }, 1.0)

    this.schedule(() => {
      this.updateSidebarValues()
    }, 0.1)
  },
  printTitle: function () {
    const titleLabel = cc.LabelTTF.create('Hujan', resource.fonts.pou.name, 24)
    titleLabel.setPosition(
      (1 / 100) * cc.director.getWinSize().width,
      cc.director.getWinSize().height - (1 / 100) * cc.director.getWinSize().height
    )
    titleLabel.setColor('black')
    titleLabel.setAnchorPoint(0, 1)
    this.addChild(titleLabel, helper.zOrder.medium)
  },
  sidebarKeys: [],
  updateSidebarKeys: function () {
    // remove old nodes, then update with new data
    for (let oldSidebarKey of this.sidebarKeys) {
      this.removeChild(oldSidebarKey)
    }
    this.sidebarKeys = []

    const names = data.plants.filter((plant) => plant.level === model.user.level).map((plant) => plant.name)
    var counter = 0
    var height = 0
    for (let name of names) {
      const sidebarKey = cc.LabelTTF.create(name, resource.fonts.pou.name, 16)
      const sortHeight = counter * height
      sidebarKey.setPosition(
        cc.director.getWinSize().width - (8 / 100) * cc.director.getWinSize().width,
        cc.director.getWinSize().height - (5 / 100) * cc.director.getWinSize().height - sortHeight
      )
      sidebarKey.opacity = this.RIGHT_SIDEBAR_OPACITY
      sidebarKey.setColor('black')
      sidebarKey.setAnchorPoint(1, 1)
      height = sidebarKey.height
      this.addChild(sidebarKey, helper.zOrder.medium)
      this.sidebarKeys.push(sidebarKey)
      counter++
    }
  },
  sidebarValues: [],
  updateSidebarValues: function (sidebar) {
    // remove old nodes, then update with new data
    for (let oldSidebarKey of this.sidebarValues) {
      this.removeChild(oldSidebarKey)
    }
    this.sidebarValues = []

    const ids = data.plants.filter((plant) => plant.level === model.user.level).map((plant) => plant.id)
    var counter = 0
    var height = 0
    for (let id of ids) {
      const plants = model.user.plantsCollection.filter((plantId) => plantId === id)
      const sidebarValue = cc.LabelTTF.create(plants.length + 'X', resource.fonts.pou.name, 16)
      window.sidebarValue = sidebarValue
      const sortHeight = counter * height
      sidebarValue.setPosition(
        cc.director.getWinSize().width - (3 / 100) * cc.director.getWinSize().width,
        cc.director.getWinSize().height - (5 / 100) * cc.director.getWinSize().height - sortHeight
      )
      sidebarValue.opacity = this.RIGHT_SIDEBAR_OPACITY
      sidebarValue.setColor('black')
      sidebarValue.setAnchorPoint(1, 1)
      height = sidebarValue.height
      this.addChild(sidebarValue, helper.zOrder.medium)
      this.sidebarValues.push(sidebarValue)
      counter++
    }
  },
})

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

layers.play.Level = cc.Layer.extend({
	CLOUD_SCALE: 0.4,
	GROUND_SCALE: 0.5,

	isPrintRaindrop: true,

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
		ground.setScale(this.GROUND_SCALE)
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
		const groundScale = this.GROUND_SCALE
		ground.scheduleOnce(() => {
			window.ground = ground
			model.once.plantY = ground.height * groundScale * 0.9
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
		this.addChild(new layers.play.Sidebar(), helper.zOrder.medium)
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
		cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.FIXED_WIDTH)

		cc.LoaderScene.preload(
			resource.preload.playScene,
			async function () {
				if (config.mode === 'production') {
					await FBInstant.startGameAsync()
				}

				await model.initUser()
				cc.director.runScene(new LevelScene())
			},
			this
		)
	}

	cc.game.run('gameCanvas', onGameStart)
}

window.onload = app.startGame
