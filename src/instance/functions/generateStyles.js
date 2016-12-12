function generateStyles (element) {
	const computed = window.getComputedStyle(element.node);

	const styles = {
		existing: {},
		transition: {},
		transform: {},
	};

	// styles.existing.computed = {
	// 	opacity: computed.opacity,
	// 	transition: computed.transition,
	// 	transform: computed.transform,
	// };

	// styles.existing.inline = element.node.getAttribute('style') || '';

	return styles;
}


export default generateStyles;
