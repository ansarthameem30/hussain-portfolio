/**
 * MongoDB connection helper for future admin panel & dynamic data storage.
 * To enable real database persistence, add MONGODB_URI in .env.local
 * Example: MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/hussain_portfolio"
 */

import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDatabase(): Promise<Db | null> {
  if (!uri) {
    // Graceful fallback when MongoDB is not yet configured
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;
  return connectedClient.db();
}
