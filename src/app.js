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
