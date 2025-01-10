/*
  Warnings:

  - You are about to drop the `UserServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserServices";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserServicesData" (
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

-- CreateIndex
CREATE UNIQUE INDEX "UserServicesData_serviceId_key" ON "UserServicesData"("serviceId");
