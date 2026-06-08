/*
  Warnings:

  - You are about to drop the column `description` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "description",
ADD COLUMN     "servicesIds" TEXT[];
