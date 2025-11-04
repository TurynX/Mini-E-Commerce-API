/*
  Warnings:

  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `productIds` on the `cartitem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `productIds`,
    ADD COLUMN `productIds` INTEGER NOT NULL;

-- DropTable
DROP TABLE `order`;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productIds_fkey` FOREIGN KEY (`productIds`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
