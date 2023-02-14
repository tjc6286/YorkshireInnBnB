import { ReservationsCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllReservations = async () => {
  const reviews = await (await ReservationsCollection()).find({}).toArray();
  return reviews;
};
