const PlayScene = cc.Scene.extend({
	onEnter: function () {
		this._super()

		this.createLayers()
		this.addListener()
	},
	createLayers: function () {
		this.addChild(new layers.play.Bg(), helper.zOrder.low)
		this.addChild(new layers.play.Level(), helper.zOrder.medium)
		window.f = this
	},
	addListener: function () {
		const listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				model.data.cloudPosX = touch.getLocationX()
				return true
			},
			// trigger when moving touch
			onTouchMoved: function (touch, event) {
				model.data.cloudPosX = touch.getLocationX()
			},
			// process the touch end event
			//onTouchEnded: function (touch, event) {
			//},
		})

		cc.eventManager.addListener(listener1, this)
	},
})
