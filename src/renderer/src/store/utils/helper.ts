import {
  createWithEqualityFn,
  UseBoundStoreWithEqualityFn,
} from 'zustand/traditional'
import { StateCreator, StoreMutatorIdentifier } from 'zustand/vanilla'
import { shallow } from 'zustand/shallow'

const storeMap = {} as Record<string, UseBoundStoreWithEqualityFn<any>>

declare const window: any
export const createZustandStore =
  <T>(name: string) =>
  <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    store: StateCreator<T, [], Mos>,
    defaultEqualityFn?: <U>(a: U, b: U) => boolean,
  ) => {
    const newStore = createWithEqualityFn(store, defaultEqualityFn ?? shallow)
    // import.meta.env.DEV
    //   ? createWithEqualityFn(
    //       devtools(store, {
    //         enabled: DEBUG,
    //         name,
    //       }),
    //       shallow,
    //     )
    //   : createWithEqualityFn(store, shallow)

    storeMap[name] = newStore

    window.store =
      window.store ||
      new Proxy(
        {},
        {
          get(_, prop) {
            if (prop in storeMap) {
              return storeMap[prop as string].getState()
            }
            return
          },
        },
      )

    return newStore
  }
