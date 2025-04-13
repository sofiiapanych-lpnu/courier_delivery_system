/*
  Warnings:

  - The primary key for the `courier_weekly_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "courier_weekly_schedules" DROP CONSTRAINT "courier_weekly_schedules_pkey",
ADD COLUMN     "weekly_id" SERIAL NOT NULL,
ADD CONSTRAINT "courier_weekly_schedules_pkey" PRIMARY KEY ("weekly_id");
