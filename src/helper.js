const helper = {
	virtual: {
		width: 800, // always equal to cc.winSize.width
		height: 450, // not always equal to cc.winSize.height, sometimes cc.winSize.height = 369
	},
	zOrder: {
		zero: 0,
		low: 1,
		medium: 5,
		high: 10,
	},
	insideFBIframe: () => {
		try {
			return window.self !== window.top
		} catch (e) {
			return true
		}
	},
}
