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
 * @param {newReservation}
 * @returns
 */
export const insertNewReservation = async (newReservation: Reservation) => {
  const reservations = await ReservationsCollection();
  return await reservations.insert(newReservation);
};

/**
 *
 * @param {reservation}
 * @param {updatedReservation}
 * @returns
 */
export const updateReservation = async (reservationID: string, updatedReservation: Reservation) => {
  const reservations = await ReservationsCollection();
  return await reservations.update({_id:new ObjectId(reservationID)}, updatedReservation);
};
