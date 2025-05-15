import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';
import app from '../src/api/route.ts';

let cars = [
  { id: 0, photo: "./ferrari458italia.jpeg", name: "Ferrari 458 Italia", price: 125000 },
  { id: 1, photo: "./lamborghinigallardo.jpeg", name: "Lamborghini Gallardo", price: 100000 },
  { id: 2, photo: "./mclaren675lt.jpeg", name: "Mclaren 675lt", price: 150000 },
  { id: 3, photo: "./mercedesamggts.jpeg", name: "Mercedes AMG GT S", price: 80000 },
  { id: 4, photo: "./bmwm4gts.jpeg", name: "Bmw M4 GTS", price: 100000 }
];

beforeEach(() => {
  cars = [
    { id: 0, photo: "./ferrari458italia.jpeg", name: "Ferrari 458 Italia", price: 125000 },
    { id: 1, photo: "./lamborghinigallardo.jpeg", name: "Lamborghini Gallardo", price: 100000 },
    { id: 2, photo: "./mclaren675lt.jpeg", name: "Mclaren 675lt", price: 150000 },
    { id: 3, photo: "./mercedesamggts.jpeg", name: "Mercedes AMG GT S", price: 80000 },
    { id: 4, photo: "./bmwm4gts.jpeg", name: "Bmw M4 GTS", price: 100000 }
  ];
});

describe('GET /api/cars', () => {
  it('returns cars below priceRange', async () => {
    const res = await request(app).get('/api/cars?priceRange=100000');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((car: any) => {
      expect(car.price).toBeLessThanOrEqual(100000);
    });
  });

  it('returns 400 for invalid priceRange', async () => {
    const res = await request(app).get('/api/cars?priceRange=abc');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('filters by name and price', async () => {
    const res = await request(app).get('/api/cars?priceRange=150000&name=Ferrari');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toMatch(/ferrari/i);
  });

  it('returns sorted cars by price_asc', async () => {
    const res = await request(app).get('/api/cars?priceRange=150000&sortBy=price_asc');
    expect(res.status).toBe(200);
    expect(res.body[0].price).toBeLessThanOrEqual(res.body[1].price);
  });

  it('returns sorted cars by price_desc', async () => {
    const res = await request(app).get('/api/cars?priceRange=150000&sortBy=price_desc');
    expect(res.status).toBe(200);
    expect(res.body[0].price).toBeGreaterThanOrEqual(res.body[1].price);
  });

  it('returns sorted cars by name_asc', async () => {
    const res = await request(app).get('/api/cars?priceRange=150000&sortBy=name_asc');
    expect(res.status).toBe(200);
    expect(res.body[0].name.localeCompare(res.body[1].name)).toBeLessThanOrEqual(0);
  });

  it('returns sorted cars by name_desc', async () => {
    const res = await request(app).get('/api/cars?priceRange=150000&sortBy=name_desc');
    expect(res.status).toBe(200);
    expect(res.body[0].name.localeCompare(res.body[1].name)).toBeGreaterThanOrEqual(0);
  });
});

describe('POST /api/cars', () => {
  it('creates a new car', async () => {
    const res = await request(app)
      .post('/api/cars')
      .send({ name: "Test Car", price: 99999, photo: "./test.jpeg" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe("Test Car");
  });

  it('fails with invalid data (empty name)', async () => {
    const res = await request(app)
      .post('/api/cars')
      .send({ name: "", price: 99999, photo: "./test.jpeg" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('fails with invalid data (negative price)', async () => {
    const res = await request(app)
      .post('/api/cars')
      .send({ name: "Invalid Car", price: -1, photo: "./test.jpeg" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('fails with missing data (missing photo)', async () => {
    const res = await request(app)
      .post('/api/cars')
      .send({ name: "Test Car", price: 99999 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('PUT /api/cars/:id', () => {
  it('updates an existing car', async () => {
    const res = await request(app)
      .put('/api/cars/1')
      .send({ name: "Updated Lamborghini", price: 110000, photo: "./updated-lambo.jpeg" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Lamborghini");
    expect(res.body.price).toBe(110000);
  });

  it('returns 404 when updating non-existing car', async () => {
    const res = await request(app)
      .put('/api/cars/999')
      .send({ name: "Non-existent Car", price: 50000, photo: "./nonexistent.jpeg" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('fails with missing data (missing name)', async () => {
    const res = await request(app)
      .put('/api/cars/1')
      .send({ price: 120000, photo: "./missing-name.jpeg" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('DELETE /api/cars/:id', () => {
  it('deletes an existing car', async () => {
    const res = await request(app).delete('/api/cars/2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(2);
  });

  it('returns 404 when deleting non-existing car', async () => {
    const res = await request(app).delete('/api/cars/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('does not delete the car if it does not exist', async () => {
    const res = await request(app).delete('/api/cars/999');
    expect(res.status).toBe(404);
  });
});
