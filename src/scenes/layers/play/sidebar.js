layers.play.Sidebar = cc.Layer.extend({
  ctor: function () {
    this._super()

    this.printTitle()

    this.updateSidebarKeys()
    this.schedule(() => {
      this.updateSidebarKeys()
    }, 1.0)

    this.schedule(() => {
      this.updateSidebarValues()
    }, 0.1)
  },
  printTitle: function () {
    const titleLabel = cc.LabelTTF.create('Hujan', resource.fonts.pou.name, 24)
    titleLabel.setPosition(
      (1 / 100) * cc.director.getWinSize().width,
      cc.director.getWinSize().height - (1 / 100) * cc.director.getWinSize().height
    )
    titleLabel.setColor('black')
    titleLabel.setAnchorPoint(0, 1)
    this.addChild(titleLabel, helper.zOrder.medium)
  },
  sidebarKeys: [],
  updateSidebarKeys: function () {
    // remove old nodes, then update with new data
    for (let oldSidebarKey of this.sidebarKeys) {
      this.removeChild(oldSidebarKey)
    }
    this.sidebarKeys = []

    const names = data.plants.filter((plant) => plant.level === model.user.level).map((plant) => plant.name)
    var counter = 1
    var height = 0
    for (let name of names) {
      const sidebarKey = cc.LabelTTF.create(name, resource.fonts.pou.name, 16)
      sidebarKey.setPosition(
        cc.director.getWinSize().width - (8 / 100) * cc.director.getWinSize().width,
        cc.director.getWinSize().height - (5 / 100) * cc.director.getWinSize().height + counter * height
      )
      sidebarKey.setColor('black')
      sidebarKey.setAnchorPoint(1, 1)
      height = sidebarKey.height
      this.addChild(sidebarKey, helper.zOrder.medium)
      this.sidebarKeys.push(sidebarKey)
    }
  },
  sidebarValues: [],
  updateSidebarValues: function (sidebar) {
    // remove old nodes, then update with new data
    for (let oldSidebarKey of this.sidebarValues) {
      this.removeChild(oldSidebarKey)
    }
    this.sidebarValues = []

    const ids = data.plants.filter((plant) => plant.level === model.user.level).map((plant) => plant.id)
    var counter = 1
    var height = 0
    for (let id of ids) {
      const plants = model.user.plantsCollection.filter((plantId) => plantId === id)
      const sidebarKey = cc.LabelTTF.create(plants.length + 'X', resource.fonts.pou.name, 16)
      sidebarKey.setPosition(
        cc.director.getWinSize().width - (3 / 100) * cc.director.getWinSize().width,
        cc.director.getWinSize().height - (5 / 100) * cc.director.getWinSize().height + counter * height
      )
      sidebarKey.setColor('black')
      sidebarKey.setAnchorPoint(1, 1)
      height = sidebarKey.height
      this.addChild(sidebarKey, helper.zOrder.medium)
      this.sidebarValues.push(sidebarKey)
    }
  },
})
