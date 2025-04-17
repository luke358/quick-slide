import { jotaiStore } from "@renderer/lib/jotai"
import { Provider } from "jotai"
import { Suspense } from "react"
import { LazyContextMenuProvider } from "./lazy"
import { RouterProvider } from "react-router-dom"
import router from "@renderer/router"
import { persistConfig, queryClient } from "@renderer/lib/query-client"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook"
import { HotKeyScopeMap } from "@renderer/constants/hotkeys"

export const RootProvider = () => {
  return <HotkeysProvider initiallyActiveScopes={HotKeyScopeMap.Home}>
    <Provider store={jotaiStore}>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistConfig}>
        <RouterProvider router={router}></RouterProvider>

        <DisableMetaW />

        <Suspense>
          <LazyContextMenuProvider />
        </Suspense>
      </PersistQueryClientProvider>
    </Provider>
  </HotkeysProvider>
}

const DisableMetaW = () => {
  useHotkeys("Meta+W", (e) => {
    e.preventDefault()
  })
  return null
}
