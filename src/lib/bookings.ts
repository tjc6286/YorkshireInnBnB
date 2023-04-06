import { ObjectId } from "mongodb";
import { logYellow, logBlue, logRed, logMessage } from "./logger";
import type { Booking } from "../types/Booking";
import type { Customer } from "../types/customer";
import type { Reservation } from "../types/reservation";
import { getCustomerByID } from "./customers";
import {
  disconnectDB,
  BookingsCollection,
  CustomersCollection,
  ReservationsCollection,
  getMongoClient,
  InProcessBookingCollection,
} from "./mongodb";

/**
 * Method to get all bookings from the Bookings collection
 * @returns Array of Booking objects
 */
export const getAllBookings = async () => {
  //SERVER LOGGING
  logMessage("Method: getAllBookings", "Getting All Bookings");
  const bookings = await (await BookingsCollection()).find({}).toArray();
  disconnectDB();
  return bookings;
};

/**
 * Method to get a booking by its ID from the Bookings collection.
 * @param bookingId ID of the Booking to get from the Bookings collection
 * @returns Booking object
 */
export const getBookingByID = async (bookingId: ObjectId) => {
  //SERVER LOGGING
  logMessage("Method: getBookingByID", "Getting Booking by ID: " + bookingId);

  const bookings = await (await BookingsCollection())
    .find({ _id: bookingId })
    .toArray();
  disconnectDB();
  return bookings[0];
};

/**
 * Method to get booking by its id and returning the booking, customer, and reservations attached to it.
 *
 * @param bookingId ID of the Booking to get from the Bookings collection
 * @returns Object containing the Booking, Customer, and Reservations
 */
export const bookingLookup = async (bookingId: string) => {
  //SERVER LOGGING
  logMessage("Method: bookingLookup", "Getting Booking by ID: " + bookingId);

  const bookings = await (await BookingsCollection())
    .find({ _id: new ObjectId(bookingId) })
    .toArray();

  const customer = await (await CustomersCollection())
    .find({ _id: new ObjectId(bookings[0].customerID) })
    .toArray();

  const reservations = await (await ReservationsCollection())
    .find({ _id: { $in: bookings[0].reservationIDs } })
    .toArray();

  //create object to return using the booking, customer, and reservations
  const bookingReturn = {
    booking: bookings[0],
    customer: customer[0],
    reservations: reservations,
  };
  disconnectDB();
  return bookingReturn;
};

/**
 * Method to insert a new booking into the Bookings collection.
 * @param newBooking Booking object to insert into the Bookings collection
 * @returns insertedId of the Booking Object inserted into the Bookings collection
 */
export const insertNewbooking = async (newBooking: any) => {
  //SERVER LOGGING
  logMessage("Method: insertNewbooking", "Inserting New Booking" + newBooking);

  const bookingcollection = await BookingsCollection();

  const insertedBooking = await bookingcollection.insertOne(newBooking);
  disconnectDB();
  return insertedBooking.insertedId;
};

/**
 * Method to update a booking by its ID and update it with the updatedBooking object.
 * @param bookingID ID of the Booking to update
 * @param updatedBooking Updated Booking object
 * @returns Booking object
 */
export const updateBooking = async (
  bookingID: string,
  updatedBooking: Booking
) => {
  //SERVER LOGGING
  logMessage("Method: updateBooking", "Updating Booking by ID: " + bookingID);
  logMessage("Method: updateBooking", "Updated Booking: " + updatedBooking);

  const bookingcollection = await BookingsCollection();
  const returnBooking = await bookingcollection.update(
    { _id: new ObjectId(bookingID) },
    updatedBooking
  );
  disconnectDB();
  return returnBooking;
};

/**
 * Inserts a new InProcessBooking into the InProcessBooking collection.
 *
 * @param {newbooking} new InProcessBooking to insert into the InProcessBooking collection
 * @returns {bookingID} the ID of the booking that was inserted
 */
export const insertNewInProcessBooking = async (newBooking: any) => {
  //SERVER LOGGING
  logMessage(
    "Method: insertNewInProcessBooking",
    "Inserting New Booking Obj:" + newBooking
  );

  const bookingcollection = await InProcessBookingCollection();
  //TODO: validate the information
  try {
    const result = await bookingcollection.insertOne(newBooking);
    return result.insertedId;
  } catch (e) {
    console.log("Error: Problem inserting temporary booking: " + newBooking);
  } finally {
    disconnectDB();
  }
};

/**
 * Gets a InProcessBooking by its ID
 *
 * @param bookingId ID of the InProcessBooking to get
 * @returns InProcessBooking object
 */
export const getInProcessBookingByID = async (bookingId: string) => {
  //SERVER LOGGING
  logMessage(
    "Method: getInProcessBookingByID",
    "Getting InProcessBooking by ID: " + bookingId
  );

  //TODO: add the correct parameters to the find
  const inProcessBookings = await (await InProcessBookingCollection())
    .find({ _id: new ObjectId(bookingId) })
    .toArray();

  disconnectDB();
  return inProcessBookings[0];
};

/**
 * Remove a Booking by the passed in ID.
 *
 * @param bookingId ID of the Booking to remove
 * @returns Booking object
 */
export const removeBookingByID = async (bookingId: ObjectId) => {
  //SERVER LOGGING
  logMessage(
    "Method: removeBookingByID",
    "Removing Booking by ID: " + bookingId
  );

  const bookingcollection = await BookingsCollection();
  const result = await bookingcollection.findOneAndDelete({ _id: bookingId });

  // result.value contains the deleted document or null if no document was found
  disconnectDB();
  return result.value;
};

//BOOKING TRANSACTION EXAMPLE
// export const bookingCreateTransaction = async (
//   newBooking: Booking,
//   newCustomer: Customer,
//   newReservation: Reservation
// ) => {
//   const client = await getMongoClient();
//   client.connect();
//   const db = client.db("YorkshireInnBnB");
//   const session = client.startSession();

//   const transactionOptions = {
//     readPreference: "primary",
//     readConcern: { level: "local" },
//     writeConcern: { w: "majority" },
//   };

//   const ret = {
//     booking: undefined,
//     customer: undefined,
//     reservation: undefined,
//   };

//   try {
//     await session.withTransaction(async () => {
//       const bookingCollection = db.collection("Booking");
//       const customerCollection = db.collection("Customer");
//       const ReservationsCollection = db.collection("RoomReservation");

//       ret.booking = await bookingCollection.insertOne(newBooking, { session });
//       ret.customer = await customerCollection.insertOne(newCustomer, {
//         session,
//       });
//       ret.reservation = await ReservationsCollection.insertOne(newReservation, {
//         session,
//       });

//       //Add into all the collections
//     }, transactionOptions);
//   } finally {
//     await session.endSession();
//     await client.close();
//   }
//   return ret;
// };
