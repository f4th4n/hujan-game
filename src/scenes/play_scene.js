const PlayScene = cc.Scene.extend({
	onEnter: function () {
		this._super()
		const size = cc.director.getWinSize()
		const sprite = cc.Sprite.create('assets/img/flower_1.png')
		sprite.setPosition(size.width / 2, size.height / 2)
		sprite.setScale(0.8)
		this.addChild(sprite, 0)

		const label = cc.LabelTTF.create('Hello World', 'Arial', 40)
		label.setPosition(size.width / 2, size.height / 2)
		this.addChild(label, 1)
	},
})
