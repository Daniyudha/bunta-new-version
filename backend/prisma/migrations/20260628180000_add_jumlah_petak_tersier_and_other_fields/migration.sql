-- Add missing columns to irrigation_profiles table
-- These columns were added to the Prisma schema but never migrated to the database
-- causing 500 errors when Prisma queries them

ALTER TABLE `irrigation_profiles` ADD COLUMN `jumlahPetakTersier` INT NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `nilaiIksi` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `primaryChannelLength` DOUBLE NULL;
ALTER TABLE `irrigation_profiles` ADD COLUMN `secondaryChannelLength` DOUBLE NULL;
