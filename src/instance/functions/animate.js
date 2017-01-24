import { isElementVisible } from '../../utils/core'


export default function animate (element) {

	const isDelayed = element.config.useDelay === 'always'
		|| element.config.useDelay === 'onload' && this.pristine
		|| element.config.useDelay === 'once' && !element.seen

	let styles = [element.styles.inline]

	if (isElementVisible.call(this, element) && !element.visible) {

		styles.push(element.styles.opacity.computed)
		styles.push(element.styles.transform.generated.final)

		if (isDelayed) {
			styles.push(element.styles.transition.generated.delayed)
		} else {
			styles.push(element.styles.transition.generated.instant)
		}

		element.seen = true
		element.visible = true
		element.node.setAttribute('style', styles.join(' '))

	} else if (!isElementVisible.call(this, element) && element.visible) {

		styles.push(element.styles.opacity.generated)
		styles.push(element.styles.transform.generated.initial)
		styles.push(element.styles.transition.generated.instant)

		element.visible = false
		element.node.setAttribute('style', styles.join(' '))
	}

}
