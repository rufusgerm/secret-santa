/*
  Warnings:

  - You are about to drop the column `is_active` on the `Santa` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code` on the `Santa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Santa` DROP COLUMN `is_active`,
    DROP COLUMN `verification_code`;

-- AlterTable
ALTER TABLE `SantasOnFamilies` ADD COLUMN `santa_is_admin` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `TempAccount` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(250) NOT NULL,
    `verification_code` VARCHAR(9) NOT NULL,
    `did_activate` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL DEFAULT (NOW() + INTERVAL 30 MINUTE),

    UNIQUE INDEX `TempAccount_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
