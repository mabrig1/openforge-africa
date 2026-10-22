/**
 * SQLite schema for OpenForge offline storage.
 * Designed for Study Circles, tasks, peer activity and future AI facilitator memory.
 */

import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("openforge.db");
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS circles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      course_code TEXT,
      course_title TEXT,
      created_at INTEGER,
      last_synced_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      circle_id TEXT,
      display_name TEXT,
      role TEXT,
      joined_at INTEGER,
      FOREIGN KEY(circle_id) REFERENCES circles(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      circle_id TEXT,
      title TEXT,
      type TEXT,
      status TEXT,
      payload TEXT,
      created_at INTEGER,
      completed_at INTEGER,
      FOREIGN KEY(circle_id) REFERENCES circles(id)
    );

    CREATE TABLE IF NOT EXISTS peer_responses (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      member_id TEXT,
      content TEXT,
      created_at INTEGER,
      FOREIGN KEY(task_id) REFERENCES tasks(id)
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      circle_id TEXT,
      actor_id TEXT,
      action TEXT,
      created_at INTEGER
    );
  `);
}
