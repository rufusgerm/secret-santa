/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `santaId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Santa` table. All the data in the column will be lost.
  - The primary key for the `SantasOnFamilies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `familyId` on the `SantasOnFamilies` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `SantasOnFamilies` table. All the data in the column will be lost.
  - You are about to drop the column `santaId` on the `SantasOnFamilies` table. All the data in the column will be lost.
  - Added the required column `santa_id` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_id` to the `SantasOnFamilies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `santa_id` to the `SantasOnFamilies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_santaId_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_familyId_fkey`;

-- DropForeignKey
ALTER TABLE `SantasOnFamilies` DROP FOREIGN KEY `SantasOnFamilies_familyId_fkey`;

-- DropForeignKey
ALTER TABLE `SantasOnFamilies` DROP FOREIGN KEY `SantasOnFamilies_santaId_fkey`;

-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `createdAt`,
    DROP COLUMN `santaId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `santa_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Family` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `name` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `createdAt`,
    DROP COLUMN `familyId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `family_id` VARCHAR(191) NULL,
    ADD COLUMN `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `text` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `Santa` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `verification_code` VARCHAR(9) NULL,
    MODIFY `first_name` VARCHAR(250) NOT NULL,
    MODIFY `last_name` VARCHAR(250) NOT NULL,
    MODIFY `email` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `SantasOnFamilies` DROP PRIMARY KEY,
    DROP COLUMN `familyId`,
    DROP COLUMN `joinedAt`,
    DROP COLUMN `santaId`,
    ADD COLUMN `family_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `santa_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`family_id`, `santa_id`);

-- AddForeignKey
ALTER TABLE `SantasOnFamilies` ADD CONSTRAINT `SantasOnFamilies_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `Family`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SantasOnFamilies` ADD CONSTRAINT `SantasOnFamilies_santa_id_fkey` FOREIGN KEY (`santa_id`) REFERENCES `Santa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `Family`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_santa_id_fkey` FOREIGN KEY (`santa_id`) REFERENCES `Santa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
