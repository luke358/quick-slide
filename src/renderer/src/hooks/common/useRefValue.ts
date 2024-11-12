import { useLayoutEffect, useRef } from 'react'

export const useRefValue = <S>(
  value: S,
): Readonly<{
  current: S extends (...args: any[]) => any ? S : Readonly<S>
}> => {
  const ref = useRef<S>(value)

  useLayoutEffect(() => {
    ref.current = value
  })
  return ref as any
}
