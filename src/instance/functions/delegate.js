import { requestAnimationFrame } from '../../polyfills/requestAnimationFrame'
import animate from './animate'


export default function delegate () {
	requestAnimationFrame(animate.bind(this))
}
