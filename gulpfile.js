const gulp = require('gulp')
const concat = require('gulp-concat')
const watch = require('gulp-watch')
const terser = require('gulp-terser')

const jsFiles = [
	'src/config.js',
	'src/helper.js',
	'src/model.js',
	'src/resource.js',
	'src/scenes/layers/play/bg.js',
	'src/scenes/layers/play/level.js',
	'src/scenes/layers/layers.js',
	'src/scenes/home_scene.js',
	'src/scenes/play_scene.js',
	'src/app.js',
]

const taskWatch = () => {
	return watch('src/**/*.js', { ignoreInitial: false }, () => {
		gulp.src(jsFiles).pipe(concat('app.js')).pipe(gulp.dest('dist'))
	})
}

const build = () => {
	const terserOpt = {
		keep_fnames: true,
		mangle: true,
	}
	return gulp.src(jsFiles).pipe(concat('app.min.js')).pipe(terser(terserOpt)).pipe(gulp.dest('dist'))
}

exports.default = taskWatch
exports.watch = taskWatch
exports.build = build
