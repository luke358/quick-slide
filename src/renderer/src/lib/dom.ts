
export const preventDefault = <T extends { preventDefault: () => any }>(e: T) => e.preventDefault()

export const nextFrame = (fn: (...args: any[]) => any) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fn()
    })
  })
}
