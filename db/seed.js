import { PrismaClient, Level } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  await prisma.restaurant.createMany({
    data: [
      {
        name: "Shalom Grill",
        level: "FIRST",
        category: "MEAT",
        type: "SIT_DOWN",
        city: "Jerusalem",
        hechsher: "Badatz",
        images: "/images/shalom1.jpg"
      },
      {
        name: "Burger Express",
        level: "SECOND",
        category: "MEAT",
        type: "FAST_FOOD",
        city: "Tel Aviv",
        hechsher: "Rabbanut Mehadrin",
        images: "/images/burger.jpg"
      },
      {
        name: "Pizza Bella",
        level: "FIRST",
        category: "DAIRY",
        type: "PIZZA",
        city: "Bnei Brak",
        hechsher: "Rabbanut",
        images: "/images/pizza.jpg"
      },
      {
        name: "Ice Dream",
        level: "THIRD",
        category: "DAIRY",
        type: "ICE_CREAM",
        city: "Haifa",
        hechsher: "Badatz",
        images: "/images/icecream.jpg"
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
