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
    "problemProgress" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TrainingProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserProgress" ("correctDrills", "id", "lastTrainedAt", "patternMastery", "profileId", "sessions", "streak", "totalDrills", "updatedAt") SELECT "correctDrills", "id", "lastTrainedAt", "patternMastery", "profileId", "sessions", "streak", "totalDrills", "updatedAt" FROM "UserProgress";
DROP TABLE "UserProgress";
ALTER TABLE "new_UserProgress" RENAME TO "UserProgress";
CREATE UNIQUE INDEX "UserProgress_profileId_key" ON "UserProgress"("profileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
