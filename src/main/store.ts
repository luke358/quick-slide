import { resolve } from "node:path"

import { app } from "electron"
import { JSONFileSyncPreset } from "lowdb/node"
import { deleteProperty, getProperty, hasProperty } from "dot-prop"
import { setProperty } from "dot-prop"

let db: {
  data: {
    window: {
      isPin: boolean
      isShowing: boolean,
      width: number,
      height: number,
    }
  }
  write: () => void
  read: () => void
}

const defaultData = {
  window: {
    isPin: false,
    isShowing: true
  }
}


const createOrGetDb = () => {
  if (!db) {
    db = JSONFileSyncPreset(resolve(app.getPath("userData"), "db.json"), defaultData) as typeof db
  }
  return db
}

export const store = {
  get: <T = any>(path: string): T => {
    const db = createOrGetDb()
    return getProperty(db.data, path)
  },
  set: (path, value) => {
    const db = createOrGetDb()
    const oldValue = getProperty(db.data, path)
    setProperty(db.data, path, Object.assign(oldValue, value))
    db.write()
  },
  has: (path) => {
    const db = createOrGetDb()
    return hasProperty(db.data, path)
  },
  delete: (path) => {
    const db = createOrGetDb()
    deleteProperty(db.data, path)
    db.write()
  }
}
