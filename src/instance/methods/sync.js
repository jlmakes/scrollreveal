import initialize from '../functions/initialize'
import reveal from './reveal'


/**
 * Re-runs the reveal method for each record stored in history, useful
 * for capturing new content asynchronously loaded into the DOM.
 *
 * @return {object} - The current ScrollReveal instance.
 */
export default function sync () {
	this.store.history.forEach(record => {
	  reveal.call(this, record.target, record.options, /*record.interval,*/ true)
	})

	initialize.call(this)

	return this
}
