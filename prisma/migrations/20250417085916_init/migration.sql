-- CreateTable
CREATE TABLE "Services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "settings" TEXT NOT NULL DEFAULT ('{"isHibernateEnabled": false, "isMuted": false, "enabled": true}'),
    "serviceUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "version" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Services_serviceId_key" ON "Services"("serviceId");
