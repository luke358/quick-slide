import {
  Atom,
  createStore,
  PrimitiveAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import { selectAtom } from 'jotai/utils'
import { useCallback } from 'react'

export const jotaiStore = createStore() as ReturnType<typeof createStore>

export const createAtomAccessor = <T>(atom: PrimitiveAtom<T>) =>
  [
    () => jotaiStore.get(atom),
    (value: T) => jotaiStore.set(atom, value),
  ] as const

const options = { store: jotaiStore }

export const createAtomHooks = <T>(atom: PrimitiveAtom<T>) =>
  [
    atom,
    () => useAtom(atom, options),
    () => useAtomValue(atom, options),
    () => useSetAtom(atom, options),
    ...createAtomAccessor(atom),
    createAtomSelector(atom),
  ] as const

const noop: any[] = []

const createAtomSelector = <T>(atom: Atom<T>) => {
  const useHook = <R>(selector: (a: T) => R, deps: any[] = noop) =>
    useAtomValue(
      selectAtom(
        atom,
        useCallback(a => selector(a as T), deps),
      ),
    )

  return useHook
}
