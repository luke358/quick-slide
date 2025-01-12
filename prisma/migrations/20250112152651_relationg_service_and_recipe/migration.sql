/*
  Warnings:

  - You are about to drop the column `defaultIconUrl` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `iconUrl` on the `Services` table. All the data in the column will be lost.
  - You are about to alter the column `recipeId` on the `Services` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `icon` on table `Recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Recipes" ("createdAt", "icon", "id", "isPreset", "name", "recipeId", "serviceUrl", "updatedAt") SELECT "createdAt", "icon", "id", "isPreset", "name", "recipeId", "serviceUrl", "updatedAt" FROM "Recipes";
DROP TABLE "Recipes";
ALTER TABLE "new_Recipes" RENAME TO "Recipes";
CREATE TABLE "new_Services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "settings" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "isHibernateEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Services_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Services" ("createdAt", "enabled", "id", "isHibernateEnabled", "isMuted", "name", "recipeId", "serviceId", "serviceUrl", "settings", "updatedAt") SELECT "createdAt", "enabled", "id", "isHibernateEnabled", "isMuted", "name", "recipeId", "serviceId", "serviceUrl", "settings", "updatedAt" FROM "Services";
DROP TABLE "Services";
ALTER TABLE "new_Services" RENAME TO "Services";
CREATE UNIQUE INDEX "Services_serviceId_key" ON "Services"("serviceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
