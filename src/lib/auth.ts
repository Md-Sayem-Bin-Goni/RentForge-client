import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const rawUri = process.env.MONGODB_URI;
const isValidMongoUri =
  rawUri && (rawUri.startsWith("mongodb://") || rawUri.startsWith("mongodb+srv://"));
const uri = isValidMongoUri ? rawUri : "mongodb://localhost:27017/rentforge";

// Maintain cached client in development to prevent duplicate connections during hot reload
const globalWithMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};

const client = globalWithMongo._mongoClient || new MongoClient(uri);
if (process.env.NODE_ENV !== "production") {
  globalWithMongo._mongoClient = client;
}

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET || "rentforge_super_secure_32_char_secret_key_2026",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
    },
  },
});
