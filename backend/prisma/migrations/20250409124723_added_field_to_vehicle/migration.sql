/*
  Warnings:

  - You are about to drop the column `capacity` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `is_company_owner` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "capacity",
ADD COLUMN     "is_company_owner" BOOLEAN NOT NULL;
