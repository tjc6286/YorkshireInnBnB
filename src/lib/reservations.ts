import { ObjectId } from "mongodb";
import type { Reservation } from "../types/reservation";
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
 * Method to insert a new reservation/s into the Reservations collection
 *
 * @param newReservations Array of reservation objects to insert into the Reservations collection
 * @returns insertedId or insertedIds of the Reservation Objects inserted into the Reservations collection
 */
export const insertNewReservations = async (
  newReservations: Array<Reservation>
) => {
  const reservations = await ReservationsCollection();
  if (newReservations.length === 1) {
    const insertedReservation = await reservations.insertOne(
      newReservations[0]
    );
    return insertedReservation.insertedId;
  } else if (newReservations.length > 1) {
    const insertedReservations = await reservations.insertMany(newReservations);
    return insertedReservations.insertedIds;
  }
};

/**
 *
 * @param {reservation}
 * @param {updatedReservation}
 * @returns
 */
export const updateReservation = async (
  reservationID: string,
  updatedReservation: Reservation
) => {
  const reservations = await ReservationsCollection();
  return await reservations.update(
    { _id: new ObjectId(reservationID) },
    updatedReservation
  );
};
