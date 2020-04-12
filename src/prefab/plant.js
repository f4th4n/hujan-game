const PrefabPlant = cc.Sprite.extend({
	ctor: function () {
		this._super()
		this.initWithFile(resource.img.flower1)
		this.setAnchorPoint(0, 0)
		this.setScale(0.2)
		this.setPositionX((10 / 100) * cc.director.getWinSize().width)
	},
	onEnter: function () {},
})
