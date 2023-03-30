import { ObjectId } from "mongodb";
import type { Booking } from "../types/Booking";
import type { Customer } from "../types/customer";
import type { Reservation } from "../types/reservation";
import {
  BookingsCollection,
  getMongoClient,
  InProcessBookingCollection,
} from "./mongodb";

/**
 * Method to get all bookings from the Bookings collection
 * @returns Array of Booking objects
 */
export const getAllBookings = async () => {
  const bookings = await (await BookingsCollection()).find({}).toArray();
  return bookings;
};

/**
 * Method to get a booking by its ID from the Bookings collection.
 * @param bookingId ID of the Booking to get from the Bookings collection
 * @returns Booking object
 */
export const getBookingByID = async (booking: Booking) => {
  //TODO: add the correct parameters to the find
  const bookings = await (await BookingsCollection())
    .find({ _id: new ObjectId(booking._id) })
    .toArray();
  return bookings[0];
};

/**
 * Method to insert a new booking into the Bookings collection.
 * @param newBooking Booking object to insert into the Bookings collection
 * @returns insertedId of the Booking Object inserted into the Bookings collection
 */
export const insertNewbooking = async (newBooking: any) => {
  const bookingcollection = await BookingsCollection();

  const insertedBooking = await bookingcollection.insertOne(newBooking);
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
  const bookingcollection = await BookingsCollection();
  return await bookingcollection.update(
    { _id: new ObjectId(bookingID) },
    updatedBooking
  );
};

/**
 * Inserts a new InProcessBooking into the InProcessBooking collection.
 *
 * @param {newbooking} new InProcessBooking to insert into the InProcessBooking collection
 * @returns {bookingID} the ID of the booking that was inserted
 */
export const insertNewInProcessBooking = async (newBooking: any) => {
  const bookingcollection = await InProcessBookingCollection();
  //TODO: validate the information
  try {
    const result = await bookingcollection.insertOne(newBooking);
    return result.insertedId;
  } catch (e) {
    console.log("Error: Problem inserting temporary booking: " + newBooking);
  }
};

/**
 * Gets a InProcessBooking by its ID
 *
 * @param bookingId ID of the InProcessBooking to get
 * @returns InProcessBooking object
 */
export const getInProcessBookingByID = async (bookingId: string) => {
  //TODO: add the correct parameters to the find
  const inProcessBookings = await (await InProcessBookingCollection())
    .find({ _id: new ObjectId(bookingId) })
    .toArray();
  return inProcessBookings[0];
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
//       const reservationCollection = db.collection("RoomReservation");

//       ret.booking = await bookingCollection.insertOne(newBooking, { session });
//       ret.customer = await customerCollection.insertOne(newCustomer, {
//         session,
//       });
//       ret.reservation = await reservationCollection.insertOne(newReservation, {
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
