/**
 * Documentation for the following code:
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
 */
import { MongoClient } from "mongodb";
import { logYellow, logBlue, logRed, logMessage } from "./logger";
const uri = process.env.MONGODB_URI || import.meta.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_NAME || import.meta.env.MONGODB_NAME;
const options = {};
let cachedMongo;
let connectedClient;

/**
 * Method to connect to the DB and cache the connection client.
 * @returns {Promise<MongoClient>} The mongo client
 */
const connectToDB = async () => {
  logBlue("[Connecting to DB] - " + new Date().toLocaleTimeString());
  if (!connectedClient) {
    connectedClient = await new MongoClient(uri, options);
  }
  // Change this to your own DB name of course.
  // Or better yet, put it in your .env
  await connectedClient.connect();
  return connectedClient.db(DB_NAME);
};

/**
 * Method to disconnect from the DB
 * @returns void
 */
export const disconnectDB = async () => {
  if (connectedClient) {
    logYellow(
      "[Closing DB connection] - " + new Date().toLocaleTimeString() + "\n"
    );
    await connectedClient.close();
  }
};

/**
 * Get access to the DB
 *
 * @returns {Promise<MongoClient>} The mongo client
 */
export const getDB = async () => {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // Text above copied from :
  // https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts
  const enviroment = process.env.NODE_ENV || import.meta.env.NODE_ENV;
  if (enviroment === "development") {
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
 * Method to connect to db and pass the Reviews collection
 *
 * @returns The Reviews collection
 */
export const ReviewsCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting Review Collection");
  return db.collection("Review");
};

/**
 * Method to connect to db and pass the Rooms collection
 *
 * @returns The Rooms collection
 */
export const RoomsCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting Rooms Collection");
  return db.collection("Room");
};

/**
 * Method to connect to db and pass the Bookings collection
 *
 * @returns The Bookings Collection
 */
export const BookingsCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting Bookings Collection");
  return db.collection("Booking");
};

/**
 * Method to connect to db and pass the InProcessBookings collection
 *
 * @returns The InProcessBookings Collection
 */
export const InProcessBookingCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting InProcessBookings Collection");
  return db.collection("InProcessBooking");
};

/**
 * Method to connect to db and pass the Customer collection
 *
 * @returns The Customer Collection
 */
export const CustomersCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting Customer Collection");
  return db.collection("Customer");
};

/**
 * Method to connect to db and pass the Reservations collection
 *
 * @returns The Reservations Collection
 */
export const ReservationsCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting Reservations Collection");
  return db.collection("RoomReservation");
};

/**
 * Method to connect to db and pass the Vendor collection
 *
 * @returns The Vendor Collection
 */
export const VendorsCollection = async () => {
  const db = await getDB();
  logMessage("DB Utility", "Getting Vendors Collection");
  return db.collection("Vendor");
};
