export default function debounc (callback, delay = 350) {
  let timer
  return (...args) => {
    if (timer) { clearTimeout(timer) }

    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
