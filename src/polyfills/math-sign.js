export const polyfill = x => (x > 0) - (x < 0) || +x
export default Math.sign || polyfill
