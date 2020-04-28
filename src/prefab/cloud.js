var CloudPrefab = cc.Node.extend({
	CLOUD_SCALE: 0.4,

	sprite: null,
	shader: null,

	ctor: function () {
		this._super()

		this.createSprite()
		this.setShader()
		this.addChild(this.sprite)

		return true
	},
	setShader() {
		if ('opengl' in cc.sys.capabilities) {
			this.shader = new cc.GLProgram(resource.shaders.stripes.vertex, resource.shaders.stripes.fragment)
			this.shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION)
			this.shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS)

			this.shader.link()
			this.shader.updateUniforms()
			this.shader.use()

			if (cc.sys.isNative) {
				var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.shader)
				this.sprite.setGLProgramState(glProgram_state)
			} else {
				this.sprite.shaderProgram = this.shader
			}
		}
	},
	createSprite() {
		this.sprite = cc.Sprite.create(resource.img.cloud)
		this.sprite.setAnchorPoint(0.5, 0)
		this.setScale(this.CLOUD_SCALE)
		this.setPosition(-100, (73 / 100) * cc.director.getWinSize().height)
	},
})
