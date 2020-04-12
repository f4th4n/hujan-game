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
