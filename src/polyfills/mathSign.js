export const polyfill = x => (x > 0) - (x < 0) || +x
export const mathSign = Math.sign || polyfill
