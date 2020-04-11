const LayersPlayBg = cc.Layer.extend({
	ctor: function () {
		this._super()
		this.printBg()
	},
	printBg: function () {
		const bg = new cc.Sprite(resource.img.bg)
		bg.setAnchorPoint(0, 0)
		bg.scaleX = 20
		model.data.bg = bg
		this.addChild(bg, helper.zOrder.low)
	},
})
