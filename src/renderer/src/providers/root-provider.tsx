import { jotaiStore } from "@renderer/lib/jotai"
import { Provider } from "jotai"
import { Suspense } from "react"
import { LazyContextMenuProvider } from "./lazy"
import { RouterProvider } from "react-router-dom"
import router from "@renderer/router"
import { queryClient } from "@renderer/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"

export const RootProvider = () => {
  return <Provider store={jotaiStore}>
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router} ></RouterProvider>
      <Suspense>
        <LazyContextMenuProvider />
      </Suspense>
    </QueryClientProvider>
  </Provider>
}
