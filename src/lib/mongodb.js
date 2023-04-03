/**
 * Documentation for the following code:
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
 */
import { MongoClient } from "mongodb";

const uri = import.meta.env.MONGODB_URI;
const options = {};
let cachedMongo;

let connectedClient;

/**
 * Method to connect to the DB and cache the connection client.
 * @returns {Promise<MongoClient>} The mongo client
 */
const connectToDB = async () => {
  console.log("**Connecting to DB**");
  connectedClient = await new MongoClient(uri, options).connect();
  // Change this to your own DB name of course.
  // Or better yet, put it in your .env
  return connectedClient.db("YorkshireInnBnB");
};

/**
 * Method to disconnect from the DB
 * @returns void
 */
export const disconnectDB = async () => {
  if (connectedClient) {
    console.log("**Closing DB connection**\n");
    await connectedClient.close();
  }
};

/**
 * Get access to the mongo db client for transaction purposes
 * @returns {Promise<MongoClient>} The mongo client
 */
export const getMongoClient = async () => {
  return await new MongoClient(uri, options);
};

/**
 * Get access to the DB
 * @returns {Promise<MongoClient>} The mongo client
 */
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
 * Method to connect to db and pass the Reviews collection
 *
 * @returns The Reviews collection
 */
export const ReviewsCollection = async () => {
  console.log("**Getting Reviews Collection**");
  const db = await getDB();
  return db.collection("Review");
};

/**
 * Method to connect to db and pass the Rooms collection
 *
 * @returns The Rooms collection
 */
export const RoomsCollection = async () => {
  console.log("**Getting Rooms Collection**");
  const db = await getDB();
  return db.collection("Room");
};

/**
 * Method to connect to db and pass the Bookings collection
 *
 * @returns The Bookings Collection
 */
export const BookingsCollection = async () => {
  console.log("**Getting Bookings Collection**");
  const db = await getDB();
  return db.collection("Booking");
};

/**
 * Method to connect to db and pass the InProcessBookings collection
 *
 * @returns The InProcessBookings Collection
 */
export const InProcessBookingCollection = async () => {
  console.log("**Getting InProcessBookings Collection**");
  const db = await getDB();
  return db.collection("InProcessBooking");
};

/**
 * Method to connect to db and pass the Customer collection
 *
 * @returns The Customer Collection
 */
export const CustomersCollection = async () => {
  console.log("**Getting Customer Collection**");
  const db = await getDB();
  return db.collection("Customer");
};

/**
 * Method to connect to db and pass the Reservations collection
 *
 * @returns The Reservations Collection
 */
export const ReservationsCollection = async () => {
  console.log("**Getting Reservations Collection**");
  const db = await getDB();
  return db.collection("RoomReservation");
};
