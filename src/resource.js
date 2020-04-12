const resource = {
	img: {
		bg: 'assets/img/bg.png',
		flower1: 'assets/img/flower_1.png',
		cloud: 'assets/img/cloud.png',
		ground: 'assets/img/ground.png',
		seed: 'assets/img/seed.png',
		fingerPoint1: 'assets/img/finger_point_1.png',
		fingerPoint2: 'assets/img/finger_point_2.png',
	},
	fonts: {
		pou: { type: 'font', name: 'Pou', srcs: ['dist/fonts/Pou-RMR6.ttf'] },
	},
	particles: {
		rain: 'assets/particle_rain.plist',
	},
	preload: {},
}

resource.preload = {
	homeScene: [],
	playScene: [
		resource.img.bg,
		resource.img.flower1,
		resource.img.cloud,
		resource.img.ground,
		resource.img.seed,
		resource.fonts.pou,
		resource.particles.rain,
	],
}
