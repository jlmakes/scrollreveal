import { logger } from '../utils/generic';
import { isNode, isNodeList } from '../utils/browser';


export function getNode (target, container = document) {
	let element = null;
	if (typeof target === 'string') {
		try {
			element = container.querySelector(target);
			if (!element) {
				logger(`Querying the selector "${target}" returned nothing.`);
			}
		} catch (err) {
			logger(`"${target}" is not a valid selector.`);
		}
	}
	return isNode(target) ? target : element;
}


export function getNodes (target, container = document) {
	let elements = [];
	if (typeof target === 'string') {
		try {
			const query = container.querySelectorAll(target);
			elements = Array.prototype.slice.call(query);
			if (!elements.length) {
				logger(`Querying the selector "${target}" returned nothing.`);
			}
		} catch (err) {
			logger(`"${target}" is not a valid selector.`);
		}
	} else if (isNode(target)) {
		elements.push(target);
	}
	return isNodeList(target) ? Array.prototype.slice.call(target) : elements;
}
