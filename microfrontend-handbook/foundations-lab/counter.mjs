globalThis.__FOUNDATION_MODULE_EVALUATIONS__ ??= []
globalThis.__FOUNDATION_MODULE_EVALUATIONS__.push(import.meta.url)
export let count = 0
export const initial = count
export function increment() { count++ }
