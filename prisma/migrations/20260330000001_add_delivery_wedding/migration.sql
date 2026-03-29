-- AlterTable: Add delivery fields to Booking
ALTER TABLE "Booking" ADD COLUMN "deliveryType" TEXT NOT NULL DEFAULT 'pickup';
ALTER TABLE "Booking" ADD COLUMN "deliveryAddress" TEXT;
ALTER TABLE "Booking" ADD COLUMN "returnAddress" TEXT;
ALTER TABLE "Booking" ADD COLUMN "isOneWay" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: WeddingInquiry
CREATE TABLE "WeddingInquiry" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "eventType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 50,
    "addOns" TEXT,
    "specialRequests" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeddingInquiry_pkey" PRIMARY KEY ("id")
);
