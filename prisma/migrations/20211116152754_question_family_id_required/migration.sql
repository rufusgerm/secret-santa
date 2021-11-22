/*
  Warnings:

  - Made the column `family_id` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_family_id_fkey`;

-- AlterTable
ALTER TABLE `Question` MODIFY `family_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `TempAccount` MODIFY `expires_at` DATETIME(3) NOT NULL DEFAULT (NOW() + INTERVAL 30 MINUTE);

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
