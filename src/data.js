const data = {
	categories: ['flower', 'wood', 'fruit', 'herb', 'magical'],
	levels: [
		{
			index: 1,
			dropRate: {
				flower: 0.75,
				wood: 0.25,
				fruit: 0,
				herb: 0,
				magical: 0,
			},
		},
		{
			index: 2,
			dropRate: {
				flower: 0.3,
				wood: 0.7,
				fruit: 0,
				herb: 0,
				magical: 0,
			},
		},
		{
			index: 3,
			dropRate: {
				flower: 0.2,
				wood: 0.2,
				fruit: 0.6,
				herb: 0,
				magical: 0,
			},
		},
	],
	plants: {
		lotus: {
			id: 'lotus',
			name: 'Lotus',
			category: 'flower',
			animationMode: 'flip',
		},
		orchid: {
			id: 'orchid',
			name: 'Orchid',
			category: 'flower',
			animationMode: 2,
		},
	},
}
