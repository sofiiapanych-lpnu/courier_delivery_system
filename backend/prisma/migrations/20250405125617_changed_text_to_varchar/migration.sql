/*
  Warnings:

  - You are about to alter the column `schedule_status` on the `courier_schedules` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `license_plate` on the `couriers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `phoneNumber` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - The primary key for the `vehicles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `license_plate` on the `vehicles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `warehouses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `contact_number` on the `warehouses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- DropForeignKey
ALTER TABLE "couriers" DROP CONSTRAINT "couriers_license_plate_fkey";

-- AlterTable
ALTER TABLE "courier_schedules" ALTER COLUMN "schedule_status" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "couriers" ALTER COLUMN "license_plate" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR,
ALTER COLUMN "hash" SET DATA TYPE VARCHAR,
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_pkey",
ALTER COLUMN "license_plate" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("license_plate");

-- AlterTable
ALTER TABLE "warehouses" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "contact_number" SET DATA TYPE VARCHAR(20);

-- AddForeignKey
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_license_plate_fkey" FOREIGN KEY ("license_plate") REFERENCES "vehicles"("license_plate") ON DELETE RESTRICT ON UPDATE CASCADE;
