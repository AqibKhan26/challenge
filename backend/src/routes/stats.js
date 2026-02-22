const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../data/items.json');

let cachedStats = null;
let lastModified = 0;

async function getStats() {
  const statsData = await fs.stat(DATA_PATH);
  if (!cachedStats || statsData.mtimeMs > lastModified) {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw);
    cachedStats = {
      total: items.length,
      averagePrice: items.reduce((acc, i) => acc + i.price, 0) / items.length,
    };
    lastModified = statsData.mtimeMs;
  }
  return cachedStats;
}

router.get('/', async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;