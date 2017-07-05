import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
	entry: 'src/index.js',
	plugins: [
		json(),
		nodeResolve({ jsnext: true, main: true }),
		buble(),
	],
	targets: [
		{
			format: 'umd',
			moduleName: 'ScrollReveal',
			dest: 'dist/scrollreveal.js',
		},
		{
			format: 'es',
			dest: 'dist/scrollreveal.es.js',
		},
	],
}
