import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma';

const app = express();
const port = 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/cars', async (req: Request, res: Response) => {
  const { sortBy, priceRange, name } = req.query;

  const maxPrice = parseInt(priceRange as string);
  if (!priceRange || isNaN(maxPrice)) {
    return res.status(400).json({ error: "Invalid or missing 'priceRange' query parameter" });
  }

  const nameFilter = (name as string || '').toLowerCase();

  const sortOptions: any = {
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    name_asc: { name: 'asc' },
    name_desc: { name: 'desc' },
  };

  try {
    const cars = await prisma.car.findMany({
      where: {
        price: { lte: maxPrice },
        name: { contains: nameFilter, mode: 'insensitive' }
      },
      orderBy: sortOptions[sortBy as string] || undefined,
      include: { salesman: true } 
    });

    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.post('/api/cars', async (req: Request, res: Response) => {
  const { name, price, photo, salesmanId } = req.body;

  if (!name || !price || !photo || !salesmanId || price <= 0) {
    return res.status(400).json({ error: 'Missing required fields or invalid data' });
  }

  try {
    const newCar = await prisma.car.create({
      data: { name, price, photo, salesmanId }
    });

    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create car' });
  }
});

app.put('/api/cars/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, photo, salesmanId } = req.body;

  if (!name || !price || !photo || !salesmanId || price <= 0) {
    return res.status(400).json({ error: 'Missing required fields or invalid data' });
  }

  try {
    const updatedCar = await prisma.car.update({
      where: { id: parseInt(id) },
      data: { name, price, photo, salesmanId }
    });

    res.json(updatedCar);
  } catch (err) {
    res.status(404).json({ error: 'Car not found or update failed' });
  }
});

app.delete('/api/cars/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCar = await prisma.car.delete({
      where: { id: parseInt(id) }
    });

    res.json(deletedCar);
  } catch (err) {
    res.status(404).json({ error: 'Car not found or delete failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/api/salesmen', async (req: Request, res: Response) => {
  try {
    const salesmen = await prisma.salesman.findMany();
    console.log(salesmen);
    res.json(salesmen);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch salesmen' });
  }
});

app.get('/api/salesmen/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const salesman = await prisma.salesman.findUnique({ where: { id: parseInt(id) } });
    if (salesman) {
      res.json(salesman);
    } else {
      res.status(404).json({ error: 'Salesman not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch salesman' });
  }
});

app.post('/api/salesmen', async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newSalesman = await prisma.salesman.create({ data: { name, email, phone } });
    res.status(201).json(newSalesman);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create salesman' });
  }
});

app.put('/api/salesmen/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const updatedSalesman = await prisma.salesman.update({
      where: { id: parseInt(id) },
      data: { name, email, phone },
    });
    res.json(updatedSalesman);
  } catch (err) {
    res.status(404).json({ error: 'Salesman not found or update failed' });
  }
});

app.delete('/api/salesmen/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSalesman = await prisma.salesman.delete({ where: { id: parseInt(id) } });
    res.json(deletedSalesman);
  } catch (err) {
    res.status(404).json({ error: 'Salesman not found or delete failed' });
  }
});

// test endpoint
app.get('/api/stats/avg-price', async (req: Request, res: Response) => {
  const result = await prisma.car.groupBy({
    by: ['salesmanId'],
    _avg: { price: true },
    orderBy: { _avg: { price: 'desc' } },
    take: 10,
  });

  const enriched = await Promise.all(
    result.map(async ({ salesmanId, _avg }) => {
      const salesman = await prisma.salesman.findUnique({ where: { id: salesmanId } });
      return {
        salesmanId,
        name: salesman?.name,
        avgPrice: _avg.price,
      };
    })
  );

  res.json(enriched);
});


export default app;
