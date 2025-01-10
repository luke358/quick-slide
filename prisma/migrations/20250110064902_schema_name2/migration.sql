/*
  Warnings:

  - You are about to drop the `UserServicesData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `icon` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `isPreset` on the `Services` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `Services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settings` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserServicesData_serviceId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserServicesData";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AllServices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false
);

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
    "isHibernateEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Services" ("createdAt", "id", "name", "recipeId", "serviceUrl", "updatedAt") SELECT "createdAt", "id", "name", "recipeId", "serviceUrl", "updatedAt" FROM "Services";
DROP TABLE "Services";
ALTER TABLE "new_Services" RENAME TO "Services";
CREATE UNIQUE INDEX "Services_serviceId_key" ON "Services"("serviceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
