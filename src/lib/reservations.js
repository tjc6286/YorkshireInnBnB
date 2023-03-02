import { ReservationsCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllReservations = async () => {
  const reservations = await (await ReservationsCollection())
    .find({})
    .toArray();
  return reservations;
};

/**
 * @param {newReservation}
 * @returns
 */
export const insertNewReservation = async (newReservation) => {
  const reservations = await ReservationsCollection();
  return reservations.insert(newReservation);
};

/**
 *
 * @param {reservation}
 * @param {updatedReservation}
 * @returns
 */
export const updateReservation = async (reservation, updatedReservation) => {
  const reservations = await ReservationsCollection();
  return reservations.update(reservation, updatedReservation);
};
