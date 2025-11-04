/*
  Warnings:

  - Changed the type of `productIds` on the `cartitem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_productIds_fkey`;

-- DropIndex
DROP INDEX `CartItem_productIds_fkey` ON `cartitem`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `productIds`,
    ADD COLUMN `productIds` JSON NOT NULL;
