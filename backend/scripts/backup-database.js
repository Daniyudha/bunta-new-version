#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * Exports all data from the database using Prisma into a JSON backup file.
 * This is a portable alternative to mysqldump when MySQL client tools aren't available.
 * 
 * Usage: node scripts/backup-database.js [output-path]
 *   If output-path is omitted, saves to: ../backups/backup_YYYYMMDD_HHMMSS.json
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backup() {
  console.log('🔄 Starting database backup...\n');

  const backupData = {};

  // Get all model names from Prisma
  const modelNames = [
    'user',
    'account',
    'session',
    'verificationToken',
    'role',
    'rolePermission',
    'permission',
    'slider',
    'irrigationProfile',
    'news',
    'category',
    'gallery',
    'farmer',
    'farmerData',
    'waterLevelData',
    'rainfallData',
    'cropData',
    'contactSubmission',
    'fileStorage',
    'employee',
  ];

  for (const model of modelNames) {
    try {
      // Convert model name to Prisma format (e.g., 'waterLevel' -> 'waterLevel')
      const count = await prisma[model].count();
      console.log(`  📦 Exporting ${model}... (${count} records)`);

      const records = await prisma[model].findMany();
      backupData[model] = records;
    } catch (err) {
      console.log(`  ⚠️  Skipping ${model}: ${err.message}`);
      backupData[model] = [];
    }
  }

  // Determine output path
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
  let outputPath = process.argv[2];

  if (!outputPath) {
    const backupDir = path.join(__dirname, '..', '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    outputPath = path.join(backupDir, `backup_${timestamp}.json`);
  }

  // Add metadata
  const output = {
    metadata: {
      exportedAt: new Date().toISOString(),
      timestamp: timestamp,
      modelCount: Object.keys(backupData).length,
      totalRecords: Object.values(backupData).reduce((sum, arr) => sum + arr.length, 0),
    },
    data: backupData,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  const fileSizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Backup completed successfully!`);
  console.log(`   File: ${outputPath}`);
  console.log(`   Size: ${fileSizeMB} MB`);
  console.log(`   Total records: ${output.metadata.totalRecords}`);
  console.log(`   Models exported: ${output.metadata.modelCount}`);
}

backup()
  .catch((err) => {
    console.error('❌ Backup failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
