-- AlterTable
ALTER TABLE `Family` ADD COLUMN `rules` TEXT NULL;

-- AlterTable
ALTER TABLE `TempAccount` MODIFY `expires_at` DATETIME(3) NOT NULL DEFAULT (NOW() + INTERVAL 30 MINUTE);
