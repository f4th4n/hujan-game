const gulp = require('gulp')
const concat = require('gulp-concat')
const watch = require('gulp-watch')
const terser = require('gulp-terser')

const files = {
	app: [
		'src/config.js',
		'src/data.js',
		'src/helper.js',
		'src/model.js',
		'src/resource.js',
		'src/grow.js',
		'src/prefab/seed.js',
		'src/prefab/plant.js',
		'src/prefab/finger_point_helper.js',
		'src/scenes/layers/layers.js',
		'src/scenes/layers/play/sidebar.js',
		'src/scenes/layers/play/bg.js',
		'src/scenes/layers/play/level.js',
		'src/scenes/home_scene.js',
		'src/scenes/level_scene.js',
		'src/scenes/collection_scene.js',
		'src/app.js',
	],
	vendorDev: ['assets/vendor/cocos2d-js-v3.13.js'],
	vendorProd: ['assets/vendor/cocos2d-js-v3.13.min.js'],
}

const taskWatch = () => {
	return watch('src/**/*.js', { ignoreInitial: false }, () => {
		gulp.src(files.app).pipe(concat('app.js')).pipe(gulp.dest('dist'))
	})
}

const build = () => {
	// build vendor
	gulp.src(files.vendorDev).pipe(concat('vendor.js')).pipe(gulp.dest('dist'))
	gulp.src(files.vendorProd).pipe(concat('vendor.min.js')).pipe(gulp.dest('dist'))

	// build app
	const terserOpt = {
		keep_fnames: true,
		mangle: true,
	}
	return gulp.src(files.app).pipe(concat('app.min.js')).pipe(terser(terserOpt)).pipe(gulp.dest('dist'))
}

exports.default = taskWatch
exports.watch = taskWatch
exports.build = build
