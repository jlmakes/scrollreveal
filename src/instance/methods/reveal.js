import { getNode, getNodes, logger } from '../../utils/core';
import { deepAssign, nextUniqueId } from '../../utils/generic';
import generateStyles from '../functions/generateStyles';


function reveal (target, options /*, interval */) {

	/**
	 * The reveal method has an optional 2nd parameter,
	 * so here we just shuffle things around to accept
	 * the interval being passed as the 2nd argument.
	 */
	// if (typeof options === 'number') {
	// 	interval = options;
	// 	options = {};
	// } else {
	// 	options = options || {};
	// }

	options = options || {};

	const container = getNode(options.container || this.defaults.container);
	const targets = getNodes(target, container);

	if (!targets.length) {
		logger('Reveal cannot be performed on 0 elements.');
		return this;
	}

	// let sequenceId;
	//
	// if (typeof interval === 'number') {
	// 	sequenceId = nextUniqueId();
	// }

	targets.forEach((node) => {
		const element = {};
		const existingId = node.getAttribute('data-sr-id');

		if (existingId) {
			deepAssign(element, this.store.elements[existingId]);
		} else {
			deepAssign(element, {
				id: nextUniqueId(),
				config: {},
				node,
			});
			node.setAttribute('data-sr-id', element.id);
		}

		element.config = deepAssign({}, this.defaults, element.config, options);
		element.styles = generateStyles(element);

		if (this.store.containers.indexOf(container) === -1) {
			this.store.containers.push(container);
		}
		this.store.elements[element.id] = element;
	});

	return this;
}


export default reveal;
