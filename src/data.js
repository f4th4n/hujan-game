/*
	for every level, assumed one level has 5 plants species and player need to have 5 same plant for every species
	then player need draw ~40 times. If per draw need 10 seconds then player need 6.66 minutes to complete a level.
*/

const data = {
	categories: ['flower', 'wood', 'fruit', 'herb', 'magical'],
	plants: [
		{
			id: 'lotus',
			name: 'Lotus',
			category: 'flower',
			animationMode: 'flip',
			level: 1,
			anchorY: 0.06,
		},
		{
			id: 'orchid',
			name: 'Orchid',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'lily',
			name: 'Lily',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'plumeria',
			name: 'Plumeria',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'sunflower',
			name: 'Sunflower',
			category: 'flower',
			animationMode: 2,
			level: 1,
		},
		{
			id: 'ffff',
			name: 'ffff',
			category: 'flower',
			animationMode: 2,
			level: 2,
		},
		{
			id: 'ggggg',
			name: 'ggggg',
			category: 'flower',
			animationMode: 2,
			level: 3,
		},
	],
	levels: [
		{
			index: 1,
			plantIds: ['lotus', 'orchid', 'lily', 'plumeria', 'sunflower'],
		},
		{
			index: 2,
		},
		{
			index: 3,
		},
	],
}
