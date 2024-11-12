import { jotaiStore } from "@renderer/lib/jotai"
import { Provider } from "jotai"
import { Suspense } from "react"
import { LazyContextMenuProvider } from "./lazy"
import { RouterProvider } from "react-router-dom"
import router from "@renderer/router"

export const RootProvider = () => {
  return <Provider store={jotaiStore}>
    <RouterProvider router={router} ></RouterProvider>
    <Suspense>
      <LazyContextMenuProvider />
    </Suspense>
  </Provider>
}
