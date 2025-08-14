import { PrismaClient, Level } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.restaurant.createMany({
    data: [
      {
        name: 'Shalom Grill',
        level: Level.FIRST,
        city: 'Jerusalem',
        hechsher: 'Badatz',
        images: ['/images/shalom1.jpg','/images/shalom2.jpg']
      },
      {
        name: 'Galil Bistro',
        level: Level.SECOND,
        city: 'Tel Aviv',
        hechsher: 'Rabbanut Mehadrin',
        images: ['/images/galil1.jpg']
      },
      {
        name: 'Negev Cafe',
        level: Level.THIRD,
        city: 'Beersheba',
        hechsher: 'Rabbanut',
        images: ['/images/negev1.jpg']
      }
    ]
  });
}
main().finally(()=> prisma.$disconnect());
