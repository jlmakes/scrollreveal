import buble from 'rollup-plugin-buble'

export default {
	entry: 'src/index.js',
	plugins: [
		buble(),
	],
	format: 'umd',
	moduleName: 'ScrollReveal',
	dest: 'dist/scrollreveal.js',
}
