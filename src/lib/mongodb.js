import { MongoClient } from "mongodb";

//DOCUMENTATION
// https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
const uri = import.meta.env.MONGODB_URI;
const options = {};
let cachedMongo;

const connectToDB = async () => {
  const mongo = await new MongoClient(uri, options).connect();
  // Change this to your own DB name of course.
  // Or better yet, put it in your .env
  return mongo.db("YorkshireInnBnB");
};

/**
 * Get access to the mongo db client for transaction purposes
 * @returns
 */
export const getMongoClient = async () => {
  return await new MongoClient(uri, options);
};

export const getDB = async () => {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // Text above copied from :
  // https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts

  if (import.meta.env.NODE_ENV === "development") {
    if (!global._mongoConnection) {
      global._mongoConnection = await connectToDB();
      cachedMongo = global._mongoConnection;
      return cachedMongo;
    }
  }
  const mongo = await connectToDB();
  return mongo;
};

/**
 *
 * @returns Method to connect to db and pass  the Review collection down to the
 */
export const ReviewsCollection = async () => {
  const db = await getDB();
  return db.collection("Review");
};

/**
 *
 * @returns Method to connect to db and pass  the Rooms collection down to the
 */
export const RoomsCollection = async () => {
  const db = await getDB();
  return db.collection("Room");
};

/**
 *
 * @returns Method to connect to db and pass  the Booking collection down to the
 */
export const BookingsCollection = async () => {
  const db = await getDB();
  return db.collection("Booking");
};

/**
 *
 * @returns Method to connect to db and pass  the Customer collection down to the
 */
export const CustomersCollection = async () => {
  const db = await getDB();
  return db.collection("Customer");
};

/**
 *
 * @returns Method to connect to db and pass  the Room Reservation collection down to the
 */
export const ReservationsCollection = async () => {
  const db = await getDB();
  return db.collection("RoomReservation");
};
