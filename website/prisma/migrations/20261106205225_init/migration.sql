-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'REVIEWED', 'ANSWERED', 'CLOSED');

-- CreateTable
CREATE TABLE "CityRequest" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT,
    "ongoingCollaboration" BOOLEAN NOT NULL DEFAULT false,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "termsVersion" TEXT NOT NULL,
    "privacyVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteAfter" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRequest" (
    "id" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "dateFrom" DATE NOT NULL,
    "dateTo" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "intendedUse" TEXT,
    "ongoingCollaboration" BOOLEAN NOT NULL DEFAULT false,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "termsVersion" TEXT NOT NULL,
    "privacyVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteAfter" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CityRequest_deleteAfter_idx" ON "CityRequest"("deleteAfter");

-- CreateIndex
CREATE INDEX "CityRequest_city_idx" ON "CityRequest"("city");

-- CreateIndex
CREATE INDEX "DataRequest_deleteAfter_idx" ON "DataRequest"("deleteAfter");
