/*
  Warnings:

  - You are about to drop the column `domainID` on the `Recipes` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Recipes" ("createdAt", "icon", "id", "isPreset", "name", "recipeId", "serviceUrl", "updatedAt") SELECT "createdAt", "icon", "id", "isPreset", "name", "recipeId", "serviceUrl", "updatedAt" FROM "Recipes";
DROP TABLE "Recipes";
ALTER TABLE "new_Recipes" RENAME TO "Recipes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
