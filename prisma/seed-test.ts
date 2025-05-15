import { PrismaClient } from '../src/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.time('seeding');

  const salesmen: { name: string, email: string, phone: string }[] = [];

  // Insert 1,000 salesmen
  for (let i = 0; i < 1000; i++) {
    salesmen.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });
  }

  const createdSalesmen = await prisma.salesman.createMany({
    data: salesmen,
  });

  const salesmanIds = (await prisma.salesman.findMany({ select: { id: true } })).map(s => s.id);

  // Insert 100,000 cars in chunks
  const batchSize = 1000;
  for (let i = 0; i < 100000; i += batchSize) {
    const carsBatch = Array.from({ length: batchSize }).map(() => ({
      name: faker.vehicle.vehicle(),
      price: faker.number.int({ min: 10000, max: 150000 }),
      photo: faker.image.urlLoremFlickr({ category: 'cars' }),
      salesmanId: salesmanIds[Math.floor(Math.random() * salesmanIds.length)],
    }));

    await prisma.car.createMany({ data: carsBatch });
    console.log(`Inserted ${i + batchSize} cars`);
  }

  console.timeEnd('seeding');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
