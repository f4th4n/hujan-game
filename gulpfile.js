const gulp = require('gulp')
const concat = require('gulp-concat')
const watch = require('gulp-watch')
const terser = require('gulp-terser')

const jsFiles = ['src/helper.js', 'src/config.js', 'src/scenes/**/*.js', 'src/app.js']

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
