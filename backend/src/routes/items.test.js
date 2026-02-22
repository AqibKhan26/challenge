const request = require('supertest');
const express = require('express');
const itemsRouter = require('./items');
const fs = require('fs').promises;
const { errorHandler } = require('../middleware/errorHandler');

// Mock the fs.promises.readFile function
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

const DATA_PATH = require('path').join(__dirname, '../../../data/items.json');

describe('Items API', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/items', itemsRouter);
    app.use(errorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/items should return all items with pagination', async () => {
    const mockData = [
      { id: 1, name: 'Item A', price: 10 },
      { id: 2, name: 'Item B', price: 20 }
    ];
  
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
  
    const res = await request(app).get('/api/items');
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      items: mockData,
      page: 1,
      total: mockData.length,
      totalPages: 1
    });
  
    expect(fs.readFile).toHaveBeenCalledWith(DATA_PATH, 'utf-8');
  });
  
  it('GET /api/items with query should filter results and paginate', async () => {
    const mockData = [
      { id: 1, name: 'Apple', price: 10 },
      { id: 2, name: 'Banana', price: 20 }
    ];
  
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
  
    const res = await request(app).get('/api/items?q=app');
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      items: [{ id: 1, name: 'Apple', price: 10 }],
      page: 1,
      total: 1,
      totalPages: 1
    });
  });

  it('GET /api/items/:id should return single item', async () => {
    const mockData = [
      { id: 1, name: 'Item A', price: 10 },
      { id: 2, name: 'Item B', price: 20 }
    ];

    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const res = await request(app).get('/api/items/2');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 2, name: 'Item B', price: 20 });
  });

  it('GET /api/items/:id should return 404 for non-existent item', async () => {
    const mockData = [{ id: 1, name: 'Item A', price: 10 }];
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const res = await request(app).get('/api/items/999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Item not found');
  });

  it('Handles readFile errors', async () => {
    fs.readFile.mockRejectedValue(new Error('File read error'));

    const res = await request(app).get('/api/items');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'File read error');
  });
});