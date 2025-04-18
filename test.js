import { readFileSync } from 'node:fs'

const license = JSON.parse(readFileSync('license.json', 'utf8'))

for (const key in license) {
  if (!license[key].licenseFile) {
    console.log(key)
  }
}
