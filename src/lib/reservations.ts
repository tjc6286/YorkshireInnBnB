import { ObjectId } from "mongodb";
import type { Reservation } from "../types/reservation";
import { ReservationsCollection } from "./mongodb";

/**
 * Method to get all reservations from the Reservations collection
 * @returns Array of reservation objects
 */
export const getAllReservations = async () => {
  const reservations = await (await ReservationsCollection())
    .find({})
    .toArray();
  return reservations;
};

//get reservation by id
export const getReservationByID = async (reservationID: string) => {
  const reservations = await (await ReservationsCollection())
    .find({ _id: new ObjectId(reservationID) })
    .toArray();
  return reservations[0];
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
 * Method to get a reservation by its ID and upadte it with the updatedReservation object.
 *
 * @param reservationID ID of the reservation to update
 * @param updatedReservation Updated reservation object
 * @returns Reservation object
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
