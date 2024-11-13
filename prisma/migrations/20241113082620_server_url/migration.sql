/*
  Warnings:

  - Added the required column `serviceUrl` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "iconUrl" TEXT,
    "defaultIconUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Services" ("createdAt", "id", "name", "recipeId", "serviceId", "settings", "updatedAt") SELECT "createdAt", "id", "name", "recipeId", "serviceId", "settings", "updatedAt" FROM "Services";
DROP TABLE "Services";
ALTER TABLE "new_Services" RENAME TO "Services";
CREATE UNIQUE INDEX "Services_serviceId_key" ON "Services"("serviceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
