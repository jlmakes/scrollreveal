export default function logger (message, ...details) {
	if (this.constructor.debug && console) {
		let report = `%cScrollReveal: ${message}`
		details.forEach(detail => (report += `\n — ${detail}`))
		console.log(report, 'color: #ea654b;') // eslint-disable-line no-console
	}
}
