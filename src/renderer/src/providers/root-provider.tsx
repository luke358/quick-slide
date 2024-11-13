import { jotaiStore } from "@renderer/lib/jotai"
import { Provider } from "jotai"
import { Suspense } from "react"
import { LazyContextMenuProvider } from "./lazy"
import { RouterProvider } from "react-router-dom"
import router from "@renderer/router"
import { queryClient } from "@renderer/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook"
import { HotKeyScopeMap } from "@renderer/constants/hotkeys"

export const RootProvider = () => {
  return <HotkeysProvider initiallyActiveScopes={HotKeyScopeMap.Home}>
    <Provider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>

        <DisableMetaW />

        <Suspense>
          <LazyContextMenuProvider />
        </Suspense>
      </QueryClientProvider>
    </Provider>
  </HotkeysProvider>
}

const DisableMetaW = () => {
  useHotkeys("Meta+W", (e) => {
    e.preventDefault()
  })
  return null
}
