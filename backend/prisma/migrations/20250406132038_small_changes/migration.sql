/*
  Warnings:

  - You are about to drop the column `rating` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `fuel_type` on the `vehicles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "couriers" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "deliveries" ALTER COLUMN "delivery_cost" SET DEFAULT 0,
ALTER COLUMN "delivery_status" SET DEFAULT 'pending',
ALTER COLUMN "start_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "fuel_type";
