import animate from './animate'


export default function sequence (element) {
	const sequence = this.store.sequences[element.sequence.id]

	if (sequence) {
		animate.call(this, element)
	}

}
