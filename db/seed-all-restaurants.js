const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const restaurants = [
  {
    name: 'Entrecote',
    city: 'Jerusalem',
    neighborhood: 'Har Chotzvim',
    address: '22 Kiryat Hamada St, Har Chotzvim',
    hechsher: 'Eida Chareidis',
    website: 'https://entrecote-jerusalem.co.il/',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Grill Bar',
    city: 'Jerusalem',
    neighborhood: 'Old City / Mamilla',
    address: '1 Hasoreg St.',
    phone: '050-5299312',
    hechsher: 'Rav Machpud - Yorah Deah',
    website: 'https://grill-bar.rol.co.il/',
    level: 'THIRD',
    category: 'MEAT',
    type: 'SIT_DOWN'
  },
  {
    name: 'Lechem Basar',
    city: 'Jerusalem',
    neighborhood: 'Talpiyot',
    address: 'David Remez 4, The First Station, David Remez Square',
    phone: '02-6244808',
    hechsher: 'Rav Machpud - Yorah Deah',
    website: 'https://lehembasar-jerusalem.co.il/',
    level: 'THIRD',
    category: 'MEAT',
    type: 'SIT_DOWN'
  },
  {
    name: 'Thailandi Sushi',
    city: 'Jerusalem',
    neighborhood: 'Talpiyot / Emek',
    address: '42 Emek Refaim St.',
    phone: '026748886',
    hechsher: 'Rav Machpud - Yorah Deah',
    website: 'https://thailandi.co.il/',
    level: 'THIRD',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Tzion Hagadol',
    city: 'Jerusalem',
    neighborhood: 'Ramot / Ramat Shlomo',
    address: '255 Golda Meir Blvd, Ramot Mall',
    phone: '073-7578851',
    hechsher: 'Rav Machpud - Yorah Deah',
    website: 'https://zionhagadol.co.il/',
    level: 'THIRD',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Ruben',
    city: 'Jerusalem',
    neighborhood: 'Givat Shaul / Har Nof',
    address: '24 Kanfei Nesharim St.',
    phone: '02-647-5500',
    hechsher: 'Rav Machpud - Yorah Deah',
    website: 'https://rubenisrael.co.il/branches/jerus/',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Hallo Teiman',
    city: 'Jerusalem',
    neighborhood: 'Givat Shaul / Har Nof',
    address: '13 Weizmann Boulevard',
    phone: '02-6522525',
    hechsher: 'Rav Machpud - Yorah Deah',
    website: 'https://halloteiman.orderss.co.il/',
    level: 'THIRD',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Babba Grill',
    city: 'Jerusalem',
    neighborhood: 'Old City / Mamilla / Yaffo',
    address: '30 Jaffa Street',
    phone: '058-3206921',
    hechsher: 'Rav Machpud - Yorah Deah',
    level: 'THIRD',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Atza Sushi Bar',
    city: 'Jerusalem',
    neighborhood: 'Romeima / Shamgar',
    address: '9 Yirmiyahu St.',
    phone: '02-5026232',
    hechsher: 'Rav Rubin',
    website: 'https://atza.co.il/romema/',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Big Bite',
    city: 'Jerusalem',
    neighborhood: 'Romeima / Shamgar',
    address: '16 Shamgar St.',
    phone: '02-5382660',
    hechsher: 'Bedatz Eida Charadis',
    level: 'FIRST',
    category: 'DAIRY',
    type: 'PIZZA'
  },
  {
    name: 'Goldy\'s',
    city: 'Jerusalem',
    neighborhood: 'Romeima / Shamgar',
    address: '18 Ezras Torah St.',
    phone: '02-6200100',
    hechsher: 'Bedatz Eida Charedis',
    website: 'https://www.goldys.co.il/',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Bush Bagels',
    city: 'Jerusalem',
    neighborhood: 'Beis Yisrael / Geula',
    address: '61 Tsfanya St.',
    phone: '02-6514123',
    hechsher: 'Bedatz Eida Chareidis',
    website: 'https://bushbagel.click-eat.co.il/he',
    level: 'FIRST',
    category: 'DAIRY',
    type: 'FAST_FOOD'
  },
  {
    name: 'Ice Story',
    city: 'Jerusalem',
    neighborhood: 'Romeima / Shamgar',
    address: '14 Shamgar',
    phone: '02-997260',
    hechsher: 'Bedatz Eida Chareidis',
    website: 'https://www.1cestory.com/',
    level: 'FIRST',
    category: 'DAIRY',
    type: 'SIT_DOWN'
  },
  {
    name: 'Ricotta',
    city: 'Jerusalem',
    neighborhood: 'Har Chotzvim',
    address: '3 Kiryat HaMada St.',
    phone: '02-587-0222',
    hechsher: 'Kehilos',
    website: 'https://ricotta.co.il/',
    level: 'SECOND',
    category: 'DAIRY',
    type: 'SIT_DOWN'
  },
  {
    name: 'Zalmens',
    city: 'Jerusalem',
    neighborhood: 'Romeima / Shamgar',
    address: '5 Louis Brandeis St.',
    phone: '077-7715550',
    hechsher: 'Bedatz Eida Chareidis',
    website: 'https://zalmans.co.il/',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Zalmens',
    city: 'Jerusalem',
    address: '225 Golda Meir Boulevard, Ramot Mall',
    phone: '077-7715550',
    hechsher: 'Bedatz Eida Chareidis',
    website: 'https://zalmans.co.il/',
    level: 'FIRST',
    category: 'MEAT',
    type: 'FAST_FOOD'
  },
  {
    name: 'Sushi N Bagels',
    city: 'Jerusalem',
    neighborhood: 'Romeima / Shamgar',
    address: 'Yirmiyahu 68, Jerusalem',
    phone: '02-544-3111',
    hechsher: 'Bedatz Eida Chareidis',
    website: 'https://sushinbagels.com/',
    level: 'FIRST',
    category: 'DAIRY',
    type: 'FAST_FOOD'
  }
];

async function main() {
  console.log('Clearing existing restaurants...');
  await prisma.restaurant.deleteMany({});
  
  console.log('Seeding restaurants...');
  
  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: restaurant
    });
    console.log(`Created restaurant: ${restaurant.name}`);
  }
  
  const count = await prisma.restaurant.count();
  console.log(`Seeding completed! Total restaurants: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });