/*
  Warnings:

  - Added the required column `domainID` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "domainID" TEXT NOT NULL,
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
