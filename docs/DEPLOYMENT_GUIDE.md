# Premier Mobile Banking — Deployment & Production Guide

This guide describes how to run, build, and deploy the Premier Mobile Banking application across local, Dockerized, and production cloud environments.

---

## 1. Quick Start (Local Development)

### 1.1 Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1.2 Installation
In the project root directory:

```bash
# Install dependencies for both server and client
cd server && npm install
cd ../client && npm install
cd ..
```

### 1.3 Running the Development Stack
You can start both the backend API server and frontend mobile client concurrently:

#### Terminal 1 (Backend API Server on port 5001):
```bash
cd server
npm run dev
```

#### Terminal 2 (Frontend Client on port 5173):
```bash
cd client
npm run dev
```

Open your browser at **http://localhost:5173**.

The application will launch in the interactive mobile frame. Use the top viewport switcher to toggle between **iPhone 16 Pro**, **Pixel 9**, **Full Screen**, or the **Admin Portal**.

---

## 2. Docker & Containerized Deployment

A pre-configured `docker-compose.yml` is included for zero-configuration containerized deployments.

### 2.1 One-Click Launch
```bash
docker-compose up --build -d
```

This starts:
- **`premier-banking-server`**: Express API running on port `5001` with a persistent SQLite WAL database volume (`banking-data`).
- **`premier-banking-client`**: Production Nginx container serving the optimized React 18 build on port `5173`, with automatic API reverse-proxying.

To verify containers are healthy:
```bash
docker-compose ps
```

To stop:
```bash
docker-compose down
```

---

## 3. Production Build & Manual Deployment

### 3.1 Build Backend
```bash
cd server
npm run build
npm start
```

### 3.2 Build Frontend
```bash
cd client
npm run build
```
The optimized static production assets will be output to `client/dist/`. Serve these with Nginx, Cloudflare Pages, AWS S3/CloudFront, or Netlify.

---

## 4. Database Maintenance & Backups

The core banking database is stored at `data/banking.db` with Write-Ahead Logging (`WAL`) enabled for high concurrency.

### Hot Backup
Because SQLite WAL mode is enabled, backups can be performed live without locking active read/write operations:

```bash
sqlite3 data/banking.db ".backup data/backup_$(date +%Y%m%d_%H%M%S).db"
```

---

## 5. Automated Tests

Run the full automated test suite (including double-entry ledger atomicity, idempotency key deduplication, card controls, and role-based authorization):

```bash
cd server
npm test
```
