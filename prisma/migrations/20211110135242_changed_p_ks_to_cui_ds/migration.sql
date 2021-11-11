/*
  Warnings:

  - The primary key for the `Family` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Santa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SantasOnFamilies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `public_id` was added to the `Family` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_santaId_fkey`;

-- DropForeignKey
ALTER TABLE `Santa` DROP FOREIGN KEY `Santa_coupled_with_id_fkey`;

-- DropForeignKey
ALTER TABLE `SantasOnFamilies` DROP FOREIGN KEY `SantasOnFamilies_familyId_fkey`;

-- DropForeignKey
ALTER TABLE `SantasOnFamilies` DROP FOREIGN KEY `SantasOnFamilies_santaId_fkey`;

-- AlterTable
ALTER TABLE `Answer` MODIFY `santaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Family` DROP PRIMARY KEY,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `familyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Santa` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `coupled_with_id` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `SantasOnFamilies` DROP PRIMARY KEY,
    MODIFY `familyId` VARCHAR(191) NOT NULL,
    MODIFY `santaId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`familyId`, `santaId`);

-- AddForeignKey
ALTER TABLE `Santa` ADD CONSTRAINT `Santa_coupled_with_id_fkey` FOREIGN KEY (`coupled_with_id`) REFERENCES `Santa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SantasOnFamilies` ADD CONSTRAINT `SantasOnFamilies_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SantasOnFamilies` ADD CONSTRAINT `SantasOnFamilies_santaId_fkey` FOREIGN KEY (`santaId`) REFERENCES `Santa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_santaId_fkey` FOREIGN KEY (`santaId`) REFERENCES `Santa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
