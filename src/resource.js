const resource = {
	img: {
		bg: 'assets/img/bg.png',
		cloud: 'assets/img/cloud.png',
		ground: 'assets/img/ground.png',
		seed: 'assets/img/seed.png',
		fingerPoint1: 'assets/img/finger_point_1.png',
		fingerPoint2: 'assets/img/finger_point_2.png',
		whiteSquare: 'assets/img/white_square.png',
		runtime: {
			level1: [
				'assets/img/plant_flower_lily_1.png',
				'assets/img/plant_flower_lily_2.png',
				'assets/img/plant_flower_lotus_1.png',
				'assets/img/plant_flower_orchid_1.png',
				'assets/img/plant_flower_orchid_2.png',
				'assets/img/plant_flower_plumeria_1.png',
				'assets/img/plant_flower_plumeria_2.png',
			],
		},
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
		resource.img.cloud,
		resource.img.ground,
		resource.img.seed,
		resource.fonts.pou,
		resource.particles.rain,
	],
}
