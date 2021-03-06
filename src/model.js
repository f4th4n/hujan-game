var model = {
	user: {
		firstTime: true,
		plantsCollection: [],
		level: 1,
	},
	local: {
		cloud: {
			scheduleUpdatePos: {
				x: -200,
				on: +new Date(),
			},
		},
		plants: [], // [cc.Node]
		plantsCountCurrentSession: 0,
	},
	once: {
		// data that changed once
		plantY: -1,
	},
	layers: {
		level: {
			bg: null,
			level: null,
			sidebar: null,
		},
	},
	async initUser() {
		if (app.insideFacebook) {
			const data = await FBInstant.player.getDataAsync(['firstTime', 'plantsCollection', 'level'])
			if (data.firstTime === false) {
				this.user = { ...this.user, ...data }
			}
		} else {
			// localStorage.removeItem('user')
			const user = localStorage.getItem('user')
			if (user !== null) {
				this.user = JSON.parse(user)
			}
		}
	},
	async setUser(key, value) {
		// TODO validation
		// TODO upload to cloud, e.g facebook
		this.user[key] = value

		if (app.insideFacebook) {
			var data = {}
			data[key] = value
			await FBInstant.player.setDataAsync(data)
		} else {
			// temporary: persist on localStorage
			localStorage.setItem('user', JSON.stringify(this.user))
		}
	},
	getUser(key) {
		// TODO make sure data is synced with vendor
		return this.user[key]
	},
}
