-- AlterTable: Make User.password optional for Google OAuth
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable: Add partner/flow fields to EventBooking
ALTER TABLE "EventBooking" ADD COLUMN "partnerName" TEXT;
ALTER TABLE "EventBooking" ADD COLUMN "partnerStatus" TEXT NOT NULL DEFAULT 'none';
ALTER TABLE "EventBooking" ADD COLUMN "bookingFlow" TEXT NOT NULL DEFAULT 'pending_review';
ALTER TABLE "EventBooking" ADD COLUMN "activityLog" TEXT;

-- CreateTable: Coupon
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "scope" TEXT NOT NULL DEFAULT 'all_cars',
    "scopeItemId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
