/*
	model.user.plantsOnGround: { id: int, posX: int }
	model.user.plantsCollection: { id: int, count: int }
*/

var model = {
	user: {
		firstTime: true,
		plantsOnGround: [],
		plantsCollection: [],
	},
	local: {
		cloud: {
			scheduleUpdatePos: {
				x: 0,
				on: +new Date(),
			},
		},
		scheduleSeedsOn: [], // [{ x: int, on: Date }]
	},
	async initUser() {
		// localStorage.removeItem('user')
		const user = localStorage.getItem('user')
		if (user !== null) {
			this.user = JSON.parse(user)
		}
	},
	setUser(key, value) {
		// TODO validation
		// TODO upload to cloud, e.g facebook
		this.user[key] = value

		// temporary: persist on localStorage
		localStorage.setItem('user', JSON.stringify(this.user))
	},
	getUser(key) {
		// TODO make sure data is synced with vendor
		return this.user[key]
	},
}
