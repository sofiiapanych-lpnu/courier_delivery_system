/*
  Warnings:

  - A unique constraint covering the columns `[street_name,building_number,apartment_number,city,country]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_street_name_building_number_apartment_number_city_key" ON "addresses"("street_name", "building_number", "apartment_number", "city", "country");
