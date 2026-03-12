const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding sample data...\n');
    
    // First, check if we have any users to assign as recordedBy
    const users = await prisma.user.findMany();
    const recordedByUserId = users.length > 0 ? users[0].id : 'system';
    
    // Seed water level data
    const waterLevelData = await prisma.waterLevelData.createMany({
      data: [
        {
          location: 'Bendungan Utama',
          value: 125.5,
          unit: 'cm',
          measuredAt: new Date('2024-01-15T08:00:00Z'),
          recordedBy: recordedByUserId,
        },
        {
          location: 'Saluran Primer A',
          value: 98.2,
          unit: 'cm',
          measuredAt: new Date('2024-01-15T12:00:00Z'),
          recordedBy: recordedByUserId,
        },
        {
          location: 'Saluran Primer B',
          value: 112.8,
          unit: 'cm',
          measuredAt: new Date('2024-01-15T16:00:00Z'),
          recordedBy: recordedByUserId,
        }
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${waterLevelData.count} water level records`);
    
    // Seed rainfall data
    const rainfallData = await prisma.rainfallData.createMany({
      data: [
        {
          location: 'Stasiun Hujan 1',
          value: 45.2,
          unit: 'mm',
          measuredAt: new Date('2024-01-15T08:00:00Z'),
          recordedBy: recordedByUserId,
        },
        {
          location: 'Stasiun Hujan 2',
          value: 32.1,
          unit: 'mm',
          measuredAt: new Date('2024-01-15T12:00:00Z'),
          recordedBy: recordedByUserId,
        },
        {
          location: 'Stasiun Hujan 3',
          value: 28.7,
          unit: 'mm',
          measuredAt: new Date('2024-01-15T16:00:00Z'),
          recordedBy: recordedByUserId,
        }
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${rainfallData.count} rainfall records`);
    
    // Seed crop data
    const cropData = await prisma.cropData.createMany({
      data: [
        {
          crop: 'Padi',
          area: 25.5,
          production: 127.5,
          season: 'Musim Hujan',
          location: 'Blok A',
          recordedBy: recordedByUserId,
        },
        {
          crop: 'Jagung',
          area: 18.2,
          production: 91.0,
          season: 'Musim Hujan',
          location: 'Blok B',
          recordedBy: recordedByUserId,
        },
        {
          crop: 'Kedelai',
          area: 12.8,
          production: 38.4,
          season: 'Musim Kemarau',
          location: 'Blok C',
          recordedBy: recordedByUserId,
        }
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${cropData.count} crop records`);
    
    // Seed farmer data with proper JSON arrays for members
    const farmerData = await prisma.farmer.createMany({
      data: [
        {
          name: 'Kelompok Tani Maju Jaya',
          group: 'Maju Jaya',
          chairman: 'Budi Santoso',
          members: JSON.stringify(['Ahmad Rizki', 'Siti Nurhaliza', 'Dewi Lestari', 'Joko Widodo']),
          userId: recordedByUserId,
        },
        {
          name: 'Kelompok Tani Sejahtera',
          group: 'Sejahtera',
          chairman: 'Sari Indah',
          members: JSON.stringify(['Rina Melati', 'Agus Suparman', 'Lina Marlina', 'Rudi Hartono']),
          userId: recordedByUserId,
        },
        {
          name: 'Kelompok Tani Makmur',
          group: 'Makmur',
          chairman: 'Hendra Gunawan',
          members: JSON.stringify(['Dian Sastrowardoyo', 'Tono Sutrisno', 'Maya Septiana', 'Bambang Pamungkas']),
          userId: recordedByUserId,
        }
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${farmerData.count} farmer records`);
    
    console.log('\n✅ Sample data seeding completed successfully!');
    console.log('\nData Summary:');
    console.log('- Water Level: 3 records');
    console.log('- Rainfall: 3 records');
    console.log('- Crops: 3 records');
    console.log('- Farmers: 3 records');
    console.log('\nYou can now test the data management functionality.');
    
  } catch (error) {
    console.error('Error seeding sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();