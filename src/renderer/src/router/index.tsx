import SlideLayout from "@renderer/layouts/SlideLayout";
import Home from "@renderer/pages/home";
import Overlay from "@renderer/pages/overlay";
import { createHashRouter } from "react-router-dom";

const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: '/',
    element: <SlideLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
    ]
  },
  {
    path: '/overlay',
    element: <Overlay />
  }
])

export default router
