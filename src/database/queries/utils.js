function withGet(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (typeof obj.get !== 'function') {
    Object.defineProperty(obj, 'get', {
      value: () => obj,
      enumerable: false,
      configurable: true,
    })
  }
  return obj
}

function withGetArray(arr) {
  if (!Array.isArray(arr)) return arr
  return arr.map((o) => withGet(o))
}

export { withGet, withGetArray }
