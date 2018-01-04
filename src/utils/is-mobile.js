export default function isMobile (agent = navigator.userAgent) {
	return /Android|iPhone|iPad|iPod/i.test(agent)
}
