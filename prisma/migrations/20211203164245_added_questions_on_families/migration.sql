-- CreateTable
CREATE TABLE `QuestionsOnFamilies` (
    `family_id` VARCHAR(191) NOT NULL,
    `question_id` INTEGER NOT NULL,

    PRIMARY KEY (`family_id`, `question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestionsOnFamilies` ADD CONSTRAINT `QuestionsOnFamilies_family_id_fkey` FOREIGN KEY (`family_id`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionsOnFamilies` ADD CONSTRAINT `QuestionsOnFamilies_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
