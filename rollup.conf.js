import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
	entry: 'src/index.js',
	plugins: [
		nodeResolve({ jsnext: true, main: true }),
		buble(),
	],
	format: 'umd',
	moduleName: 'ScrollReveal',
	dest: 'dist/scrollreveal.js',
}
