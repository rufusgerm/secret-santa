-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_santa_id_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_family_id_fkey`;

-- DropForeignKey
ALTER TABLE `SantasOnFamilies` DROP FOREIGN KEY `SantasOnFamilies_family_id_fkey`;

-- DropForeignKey
ALTER TABLE `SantasOnFamilies` DROP FOREIGN KEY `SantasOnFamilies_santa_id_fkey`;

-- AddForeignKey
ALTER TABLE `SantasOnFamilies` ADD CONSTRAINT `SantasOnFamilies_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SantasOnFamilies` ADD CONSTRAINT `SantasOnFamilies_santa_id_fkey` FOREIGN KEY (`santa_id`) REFERENCES `Santa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_santa_id_fkey` FOREIGN KEY (`santa_id`) REFERENCES `Santa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
