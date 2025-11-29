import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const restaurants = [
  {
    name: 'Chalav U\'Dvash',
    city: 'Jerusalem',
    neighborhood: 'Ramat Eshkol / French Hill / Shmuel HaNavi',
    address: '21 Hahagana St.',
    phone: '02-9999606',
    hechsher: 'Rav Rubin',
    website: 'https://easy.co.il/en/page/10136427',
    level: 'FIRST',
    category: 'DAIRY',
    type: 'SIT_DOWN'
  },
  {
    name: 'Rodriguez',
    city: 'Jerusalem',
    hechsher: 'Rav Rubin',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Waffle Bar',
    city: 'Jerusalem',
    neighborhood: 'Ramat Eshkol / French Hill / Shmuel HaNavi',
    address: '7 Paran St.',
    phone: '02-5815434',
    hechsher: 'Rav Rubin',
    website: 'https://www.wafflebar-re.co.il/',
    level: 'FIRST',
    category: 'DAIRY',
    type: 'SIT_DOWN'
  }
];

async function main() {
  console.log('Seeding restaurants...');
  
  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: restaurant
    });
    console.log(`Created restaurant: ${restaurant.name}`);
  }
  
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });