export const nextUniqueId = (() => {
	let uid = 0
	return () => uid++
})()
