import initialize from '../functions/initialize'
import reveal from './reveal'

import { each } from '../../utils/generic'

/**
 * Re-runs the reveal method for each record stored in history,
 * for capturing new content asynchronously loaded into the DOM.
 */
export default function sync () {
	each(this.store.history, record => {
		reveal.call(this, record.target, record.options, record.interval, true)
	})

	initialize.call(this)
}
