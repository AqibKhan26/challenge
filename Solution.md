# Solution: Items Catalog

## Overview
- Backend: Express.js + JSON file storage with **async read/write** (`fs.promises`) for non-blocking I/O.
- Frontend: React with server-side search, pagination, and virtualized list rendering.

## Backend
- `GET /api/items` → Returns paginated items, supports search query (`q`).
- `GET /api/items/:id` → Returns single item.
- `POST /api/items` → Adds new item.
- Response format: `{ items, page, total, totalPages }`.
- **Trade-off:** Async JSON file I/O is simple and non-blocking, but not ideal for very large datasets.

## Frontend
- `DataContext` provides `items`, `fetchItems`, `loading`, `error`, `totalPages`.
- Server-side search triggered via **Search** button; pagination preserves search state.
- Virtualized list using **react-virtuoso** for smooth rendering of large datasets. Chose vistuoso over react-window as i was more familiar.
- Clean UI with cards, shadows, and pagination controls.

## Testing
- Jest + Supertest with mocked `fs.readFile`.
- Covers fetching all items, searching, fetching by ID, and adding items.

## Trade-offs
- Server-side search/pagination: consistent but adds backend load.
- JSON storage: simple, async but limited scaling.
- Virtualization: smooth UI, extra dependency.