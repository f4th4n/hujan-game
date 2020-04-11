const PlayScene = cc.Scene.extend({
	onEnter: function () {
		this._super()

		this.createLayers()
	},

	createLayers: function () {
		this.addChild(new layers.play.Bg(), helper.zOrder.low)
		this.addChild(new layers.play.Level(), helper.zOrder.medium)
	},
})
