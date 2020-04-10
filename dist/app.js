const helper = {
	insideFBIframe: () => {
		try {
			return window.self !== window.top
		} catch (e) {
			return true
		}
	},
}

const config = {
	debug: false,
}

const HomeScene = cc.Scene.extend({
	onEnter: function () {
		this._super()
	},
})

const PlayScene = cc.Scene.extend({
	onEnter: function () {
		this._super()
		const size = cc.director.getWinSize()
		const sprite = cc.Sprite.create('assets/img/flower_1.png')
		sprite.setPosition(size.width / 2, size.height / 2)
		sprite.setScale(0.8)
		this.addChild(sprite, 0)

		const label = cc.LabelTTF.create('Hello World', 'Arial', 40)
		label.setPosition(size.width / 2, size.height / 2)
		this.addChild(label, 1)
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
			['assets/img/flower_1.png', 'assets/img/cloud.png', 'assets/img/ground.png', 'assets/img/raindrop.png'],
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
