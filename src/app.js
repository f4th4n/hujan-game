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
