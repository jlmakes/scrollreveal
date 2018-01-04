const nextUniqueId = (() => {
	let uid = 0
	return () => uid++
})()

export default nextUniqueId
