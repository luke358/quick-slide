/*
  Warnings:

  - You are about to drop the `AllServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AllServices";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false
);
