const app = {
	insideFacebook: null,
	setup: () => {},
	startGame: () => {},
}

app.setup = () => {
	const inIframe = () => {
		try {
			return window.self !== window.top
		} catch (e) {
			return true
		}
	}

	const locals = ['127.0.0.1:8080', 'localhost:8080', '0.0.0.0:8080']
	const inLocal = locals.includes(window.location.host)
	app.insideFacebook = inIframe() || !inLocal
}

app.startGame = async () => {
	const onGameStart = async () => {
		if (app.insideFacebook) {
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
				if (app.insideFacebook) {
					await FBInstant.startGameAsync()
				}

				await model.initUser()
				cc.director.runScene(new LevelScene())
			}
		)
	}

	cc.game.run('gameCanvas', onGameStart)
}

app.setup()
window.onload = app.startGame
