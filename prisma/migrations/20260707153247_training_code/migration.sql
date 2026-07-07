/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserStudyPlan` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `UserProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `UserStudyPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TrainingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeLookup" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codeHint" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "totalDrills" INTEGER NOT NULL DEFAULT 0,
    "correctDrills" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastTrainedAt" DATETIME,
    "patternMastery" TEXT NOT NULL DEFAULT '{}',
    "sessions" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TrainingProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserProgress" ("correctDrills", "id", "lastTrainedAt", "patternMastery", "sessions", "streak", "totalDrills", "updatedAt") SELECT "correctDrills", "id", "lastTrainedAt", "patternMastery", "sessions", "streak", "totalDrills", "updatedAt" FROM "UserProgress";
DROP TABLE "UserProgress";
ALTER TABLE "new_UserProgress" RENAME TO "UserProgress";
CREATE UNIQUE INDEX "UserProgress_profileId_key" ON "UserProgress"("profileId");
CREATE TABLE "new_UserStudyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "planData" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserStudyPlan_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TrainingProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserStudyPlan" ("id", "planData", "updatedAt") SELECT "id", "planData", "updatedAt" FROM "UserStudyPlan";
DROP TABLE "UserStudyPlan";
ALTER TABLE "new_UserStudyPlan" RENAME TO "UserStudyPlan";
CREATE UNIQUE INDEX "UserStudyPlan_profileId_key" ON "UserStudyPlan"("profileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProfile_codeLookup_key" ON "TrainingProfile"("codeLookup");
