import SlideLayout from "@renderer/layouts/SlideLayout";
import Home from "@renderer/pages/home";
import LinkView from "@renderer/pages/link-view";
import Overlay from "@renderer/pages/overlay";
import Shortcuts from "@renderer/pages/shortcuts";
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
    path: '/link-view',
    element: <LinkView />,
  },
  {
    path: '/shortcuts',
    element: <Shortcuts />,
  },
  {
    path: '/overlay',
    element: <Overlay />
  }
])

export default router
