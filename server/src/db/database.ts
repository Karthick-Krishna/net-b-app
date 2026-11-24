import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(__dirname, '../../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(DB_DIR, 'banking.db');

export const db: Database.Database = new Database(DB_PATH);

// Enable WAL mode for high concurrency and enforce foreign keys
if (process.env.NODE_ENV !== 'test') {
  db.pragma('journal_mode = WAL');
}
db.pragma('foreign_keys = ON');

export function runTransaction<T>(fn: () => T): T {
  return db.transaction(fn)();
}
