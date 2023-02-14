import { BookingsCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllBookings = async () => {
  const reviews = await (await BookingsCollection()).find({}).toArray();
  return reviews;
};
