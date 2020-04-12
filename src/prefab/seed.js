const PrefabSeed = cc.Sprite.extend({
	ctor: function () {
		this._super()
		this.initWithFile(resource.img.seed)
		this.setAnchorPoint(0, 0)
		this.setPosition(200, 0)
		this.setScale(0.2)
		this.setPositionX((60 / 100) * cc.director.getWinSize().width)
	},
	onEnter: function () {},
})
