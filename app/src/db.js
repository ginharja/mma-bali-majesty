import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

export const initDB = async () => {
  // Hanya jalankan SQLite jika di HP (Android/iOS). Jika di Web/Localhost, lewati.
  if (!Capacitor.isNative) return null;

  try {
    // Buat/buka database bernama 'rawgym_db'
    db = await sqlite.createConnection('rawgym_db', false, 'no-encryption', 1, false);
    await db.open();

    // Buat tabel untuk menyimpan cache data dari Laravel
    const query = `
      CREATE TABLE IF NOT EXISTS api_cache (
        endpoint TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL,
        last_updated INTEGER NOT NULL
      );
    `;
    await db.execute(query);
    return db;
  } catch (error) {
    console.error("Gagal inisialisasi SQLite:", error);
    return null;
  }
};

// Fungsi menyimpan data ke SQLite
export const saveCache = async (endpoint, dataObj) => {
  if (!db) return;
  const dataStr = JSON.stringify(dataObj);
  const now = Date.now();
  
  // Gunakan INSERT OR REPLACE (Upsert) agar data lama tertimpa
  const query = `INSERT OR REPLACE INTO api_cache (endpoint, data, last_updated) VALUES (?, ?, ?)`;
  await db.run(query, [endpoint, dataStr, now]);
};

// Fungsi mengambil data dari SQLite saat offline
export const getCache = async (endpoint) => {
  if (!db) return null;
  
  const query = `SELECT data, last_updated FROM api_cache WHERE endpoint = ?`;
  const result = await db.query(query, [endpoint]);
  
  if (result.values && result.values.length > 0) {
    return JSON.parse(result.values[0].data);
  }
  return null;
};