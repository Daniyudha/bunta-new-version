/*
  Warnings:

  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `media`;

-- CreateTable
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `education` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PNS',
    `photo` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `workRegion` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `pangkat_golongan` VARCHAR(191) NULL,
    `nip` VARCHAR(191) NULL,
    `order` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `irrigation_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `area` DOUBLE NOT NULL,
    `waterLevel` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `canals` INTEGER NULL,
    `gates` INTEGER NULL,
    `waterSource` VARCHAR(191) NULL,
    `lastUpdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
