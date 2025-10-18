/*
  Warnings:

  - You are about to drop the column `productId` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `cartitem` table. All the data in the column will be lost.
  - Added the required column `productIds` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `CartItem_productId_fkey` ON `cartitem`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `productId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `productIds` JSON NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
