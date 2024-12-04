/*
  Warnings:

  - Added the required column `orderValue` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderValue" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stkQuantity" DROP DEFAULT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
