// app/db/server.ts
import { Db, MongoClient, ObjectId } from "mongodb";

const uri = process.env.DATABASE_URI!;
const client = new MongoClient(uri);

let db: Db | null = null;

export async function getDb() {
  if (!db) {
    const conn = await client.connect();
    db = conn.db();
  }
  return db;
}

export { ObjectId };
