import { ObjectId } from "mongodb";
import type { Booking } from "../types/Booking";
import { BookingsCollection } from "./mongodb";

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
  const bookings = await (await BookingsCollection()).find({_id: booking._id}).toArray();
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
export const updateBooking = async (bookingID: string, updatedBooking: Booking) => {
  const bookingcollection = await BookingsCollection();
  return await bookingcollection.update({_id: new ObjectId(bookingID)}, updatedBooking);
};
