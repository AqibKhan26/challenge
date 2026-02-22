const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility: read JSON data asynchronously
async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    if (!raw.trim()) return []; // empty file → empty array
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data:', err);
    throw err;
  }
}

// Utility: write JSON data asynchronously
async function writeData(data) {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data:', err);
    throw err;
  }
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { q = '', page = 1, limit = 5 } = req.query;
    const data = await readData();

    // Filter by search query
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(q.toLowerCase())
    );

    // Pagination
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginated = filtered.slice(start, end);

    res.json({
      items: paginated,
      total: filtered.length,
      page: parseInt(page),
      totalPages: Math.ceil(filtered.length / limit)
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;

    // Basic validation
    if (!item.name || !item.category || typeof item.price !== 'number') {
      const err = new Error('Invalid item payload');
      err.status = 400;
      throw err;
    }

    const data = await readData();
    item.id = Date.now(); // unique id
    data.push(item);

    await writeData(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;