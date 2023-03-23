import { ObjectId } from "mongodb";
import type { Booking } from "../types/Booking";
import type { Reservation } from "../types/reservation";
import type { Customer } from "../types/customer";
import { BookingsCollection, getMongoClient } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllBookings = async () => {
  const bookings = await (await BookingsCollection()).find({}).toArray();
  return bookings;
};

/**
 * @param {bookingParams}
 * @returns
 */
export const getBookingByID = async (booking: Booking) => {
  //TODO: add the correct parameters to the find
  const bookings = await (await BookingsCollection())
    .find({ _id: new ObjectId(booking._id) })
    .toArray();
  return bookings[0];
};

/**
 * @param {newbooking}
 * @returns
 */
export const insertNewbooking = async (newBooking: Booking) => {
  const bookingcollection = await BookingsCollection();
  return await bookingcollection.insert(newBooking);
};

/**
 *
 * @param {booking}
 * @param {updateBooking}
 * @returns
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
 *
 */
export const bookingCreateTransaction = async (
  newBooking: Booking,
  newCustomer: Customer,
  newReservation: Reservation
) => {
  const client = await getMongoClient();
  client.connect();
  const db = client.db("YorkshireInnBnB");
  const session = client.startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  const ret = {
    booking: undefined,
    customer: undefined,
    reservation: undefined,
  };

  try {
    await session.withTransaction(async () => {
      const bookingCollection = db.collection("Booking");
      const customerCollection = db.collection("Customer");
      const reservationCollection = db.collection("RoomReservation");

      ret.booking = await bookingCollection.insertOne(newBooking, { session });
      ret.customer = await customerCollection.insertOne(newCustomer, {
        session,
      });
      ret.reservation = await reservationCollection.insertOne(newReservation, {
        session,
      });

      //Add into all the collections
    }, transactionOptions);
  } finally {
    await session.endSession();
    await client.close();
  }
  return ret;
};
