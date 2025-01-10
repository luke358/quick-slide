/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `defaultIconUrl` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `iconUrl` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `isHibernateEnabled` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `isMuted` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Services` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Service";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserServices" (
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "serviceUrl" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Services" ("createdAt", "id", "name", "recipeId", "serviceUrl", "updatedAt") SELECT "createdAt", "id", "name", "recipeId", "serviceUrl", "updatedAt" FROM "Services";
DROP TABLE "Services";
ALTER TABLE "new_Services" RENAME TO "Services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserServices_serviceId_key" ON "UserServices"("serviceId");
