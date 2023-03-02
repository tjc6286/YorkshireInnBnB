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
export const getBookingByObject = async (bookingParams) => {
  const bookings = await (await BookingsCollection()).findOne(bookingParams);
  return bookings;
};

/**
 * @param {newbooking}
 * @returns
 */
export const insertNewbooking = async (newBooking) => {
  const bookingcollection = await BookingsCollection();
  return bookingcollection.insert(newBooking);
};

/**
 *
 * @param {booking}
 * @param {updateBooking}
 * @returns
 */
export const updateBooking = async (booking, updatedBooking) => {
  const bookingcollection = await BookingsCollection();
  return bookingcollection.update(booking, updatedBooking);
};
