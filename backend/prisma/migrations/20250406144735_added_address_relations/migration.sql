/*
  Warnings:

  - Added the required column `address_id` to the `deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_address_id_fkey";

-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "address_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "deliveries" ADD COLUMN     "address_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;
