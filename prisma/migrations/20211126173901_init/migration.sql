-- CreateTable
CREATE TABLE `Family` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `rules` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Family_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Santa` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(250) NOT NULL,
    `last_name` VARCHAR(250) NOT NULL,
    `email` VARCHAR(250) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `coupled_with_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Santa_email_key`(`email`),
    UNIQUE INDEX `Santa_coupled_with_id_key`(`coupled_with_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TempAccount` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(250) NOT NULL,
    `verification_code` VARCHAR(9) NOT NULL,
    `invite_via_family_id` VARCHAR(191) NOT NULL,
    `did_activate` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TempAccount_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SantasOnFamilies` (
    `family_id` VARCHAR(191) NOT NULL,
    `santa_id` VARCHAR(191) NOT NULL,
    `santa_is_admin` BOOLEAN NOT NULL DEFAULT false,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`family_id`, `santa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `family_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `question_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `santa_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Santa` ADD CONSTRAINT `Santa_coupled_with_id_fkey` FOREIGN KEY (`coupled_with_id`) REFERENCES `Santa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TempAccount` ADD CONSTRAINT `TempAccount_invite_via_family_id_fkey` FOREIGN KEY (`invite_via_family_id`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
