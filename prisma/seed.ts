import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const john = await prisma.salesman.create({
    data: {
      name: 'John Doe',
      email: 'john1@example.com',
      phone: '123-456-7890',
      cars: {
        create: [
          {
            name: 'Ferrari 458 Italia',
            price: 125000,
            photo: './ferrari458italia.jpeg'
          },
          {
            name: 'Lamborghini Gallardo',
            price: 100000,
            photo: './lamborghinigallardo.jpeg'
          }
        ]
      }
    }
  });

  const jane = await prisma.salesman.create({
    data: {
      name: 'Jane Smith',
      email: 'jane1@example.com',
      phone: '987-654-3210',
      cars: {
        create: [
          {
            name: 'McLaren 675LT',
            price: 150000,
            photo: './mclaren675lt.jpeg'
          },
          {
            name: 'Mercedes AMG GT S',
            price: 80000,
            photo: './mercedesamggts.jpeg'
          },
          {
            name: 'BMW M4 GTS',
            price: 100000,
            photo: './bmwm4gts.jpeg'
          }
        ]
      }
    }
  });

  console.log('Database seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
