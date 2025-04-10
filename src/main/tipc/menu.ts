import { Menu, MenuItemConstructorOptions } from 'electron';
import { t } from './_instance';


type SerializableMenuItem = Omit<MenuItemConstructorOptions, "click" | "submenu"> & {
  // id: string
  submenu?: SerializableMenuItem[]
}

function normalizeMenuItems(
  items: SerializableMenuItem[],
  context: { sender: Electron.WebContents },
  path = [] as number[],
): MenuItemConstructorOptions[] {
  return items.map((item, index) => {

    const curPath = [...path, index]
    return {
      ...item,
      click() {
        context.sender.send("menu-click", {
          id: item.id,
          path: curPath,
        })
      },
      submenu: item.submenu ? normalizeMenuItems(item.submenu, context, curPath) : undefined,
    }
  })
}

export const menuRoute = {
  showContextMenu: t.procedure
    .input<{
      items: SerializableMenuItem[]
    }>()
    .action(({ input, context }) => {
      const defer = Promise.withResolvers<void>()
      const normalizedMenuItems = normalizeMenuItems(input.items, context)

      // See https://www.electronjs.org/docs/latest/api/menu
      const menu = Menu.buildFromTemplate(normalizedMenuItems)
      menu.popup({
        callback: () => defer.resolve(),
      })
      return defer.promise
    }),
}

