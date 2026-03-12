-- CreateTable
CREATE TABLE `water_level_data` (
    `id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL DEFAULT 'cm',
    `measuredAt` DATETIME(3) NOT NULL,
    `recordedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rainfall_data` (
    `id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL DEFAULT 'mm',
    `measuredAt` DATETIME(3) NOT NULL,
    `recordedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
