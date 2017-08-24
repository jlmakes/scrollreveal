import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
	input: 'src/index.js',
	plugins: [
		json(),
		nodeResolve({ jsnext: true, main: true }),
		buble(),
	],
	output: [
		{ format: 'umd', file: 'dist/scrollreveal.js', name: 'ScrollReveal' },
		{ format: 'es', file: 'dist/scrollreveal.es.js' },
	],
}
