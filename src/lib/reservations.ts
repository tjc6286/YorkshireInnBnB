import { ObjectId } from "mongodb";
import type { Reservation } from "../types/reservation";
import { ReservationsCollection, disconnectDB } from "./mongodb";
import { logYellow, logBlue, logRed, logMessage } from "./logger";

/**
 * Method to get all reservations from the Reservations collection
 * @returns Array of reservation objects
 */
export const getAllReservations = async () => {
  //SERVER LOGGING
  logMessage("Method: getAllReservations", "Getting All Reservations");

  const reservations = await (await ReservationsCollection())
    .find({})
    .toArray();
  disconnectDB();
  return reservations;
};

//get reservation by id
export const getReservationByID = async (reservationID: string) => {
  //SERVER LOGGING
  logMessage(
    "Method: getReservationByID",
    "Getting Reservation by ID: " + reservationID
  );

  const reservations = await (await ReservationsCollection())
    .find({ _id: new ObjectId(reservationID) })
    .toArray();
  disconnectDB();
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
  //SERVER LOGGING
  logMessage(
    "Method: insertNewReservations",
    "Inserting New Reservation:" + newReservations
  );

  const reservations = await ReservationsCollection();
  if (newReservations.length === 1) {
    const insertedReservation = await reservations.insertOne(
      newReservations[0]
    );
    disconnectDB();
    return insertedReservation.insertedId;
  } else if (newReservations.length > 1) {
    const insertedReservations = await reservations.insertMany(newReservations);
    disconnectDB();
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
  //SERVER LOGGING
  logMessage(
    "Method: updateReservation",
    "Updating Reservation: " + reservationID
  );
  logMessage(
    "Method: updateReservation",
    "Updating Reservation with: " + updatedReservation
  );

  const reservations = await ReservationsCollection();
  const returnReservation = await reservations.update(
    { _id: new ObjectId(reservationID) },
    updatedReservation
  );

  disconnectDB();

  return returnReservation;
};

/**
 * Method to cancel all reservations in the reservations array passed in.
 *
 * @param reservations Array of reservation objects to cancel
 * @returns void
 */
export const cancelReservations = async (reservations: Array<Reservation>) => {
  try {
    //SERVER LOGGING
    logMessage(
      "Method: cancelReservations",
      "Cancelling Reservations: " + reservations
    );
    console.log(reservations);

    const reservationsCollection = await ReservationsCollection();
    //loop through all reservations and update the reservation status to "cancelled"
    for (const reservation of reservations) {
      await reservationsCollection.updateOne(
        { _id: new ObjectId(reservation._id) },
        { $set: { isCancelled: true } }
      );
    }
    return true;
  } catch (error) {
    logRed("Method: cancelReservations - Error: " + error);
  } finally {
    disconnectDB();
  }
};
