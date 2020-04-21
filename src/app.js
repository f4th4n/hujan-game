const app = {
	startGame: () => {},
}

app.startGame = async () => {
	const onGameStart = async () => {
		cc.director.setDisplayStats(config.debug)

		if (config.inFacebook) {
			await FBInstant.initializeAsync()
		}

		cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.FIXED_WIDTH)

		cc.loader.load(
			resource.preload.playScene,
			function (result, count, loadedCount) {
				var percent = ((loadedCount / count) * 100) | 0
				percent = Math.min(percent, 100)
				FBInstant.setLoadingProgress(percent)
			},
			async function () {
				if (config.insideFacebook) {
					await FBInstant.startGameAsync()
				}

				await model.initUser()
				cc.director.runScene(new LevelScene())
			}
		)
	}

	cc.game.run('gameCanvas', onGameStart)
}

window.onload = app.startGame
