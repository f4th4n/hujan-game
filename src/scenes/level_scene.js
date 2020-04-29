const LevelScene = cc.Scene.extend({
	onEnter: function () {
		this._super()

		this.createLayers()
		this.addListener()
	},
	createLayers: function () {
		model.layers.level.bg = new layers.play.Bg()
		model.layers.level.level = new layers.play.Level()
		model.layers.level.sidebar = new layers.play.Sidebar()
		this.addChild(model.layers.level.bg, helper.zOrder.low)
		this.addChild(model.layers.level.level, helper.zOrder.medium)
		this.addChild(model.layers.level.sidebar, helper.zOrder.medium)
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
