layers.play.Bg = cc.Layer.extend({
	ctor: function () {
		this._super()
		this.printBg()
	},
	printBg: function () {
		const whiteRect = new cc.Sprite(resource.img.whiteSquare)
		whiteRect.setColor(cc.color.WHITE)
		whiteRect.setScaleX(cc.winSize.width / 100 + 1)
		whiteRect.setScaleY(cc.winSize.height / 100 + 1)
		whiteRect.setAnchorPoint(0, 0)
		this.addChild(whiteRect, helper.zOrder.high)
	},
})
