-- Add missing columns to employees table (tanggalPengangkatan was added to schema but not migrated)
ALTER TABLE `employees` ADD COLUMN `tanggalPengangkatan` DATETIME(3) NULL;

-- Add missing columns to irrigation_profiles table (many fields were added to schema but not migrated)
ALTER TABLE `irrigation_profiles` ADD COLUMN `regency` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `constructionYear` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `servedVillages` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `potentialArea` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `functionalArea` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `dischargeCapacity` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `channelLength` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `watershedArea` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `productivity` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `totalStructures` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `mainStructure` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `divisionStructure` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `intakeStructure` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `dropStructure` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `aqueduct` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `drainageCulvert` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `roadCulvert` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `slopingDrain` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `buildingScheme` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `networkScheme` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `p3aGroupList` JSON NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `farmingBusinessAnalysis` JSON NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `rttg` VARCHAR(191) NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `plantingSchedule` VARCHAR(191) NULL;

-- Note: buttonText on sliders table is already added in some environments, so it's excluded here.
-- If you need it, run manually: ALTER TABLE `sliders` ADD COLUMN `buttonText` VARCHAR(191) NULL DEFAULT 'Pelajari Lebih Lanjut';
