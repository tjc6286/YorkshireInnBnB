import { getAllReservations } from "../../../lib/reservations";
import { logMessage } from "../../../lib/loggerTest";
/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/reservation/getAll", "Getting All Reservations");

  const reservations = await getAllReservations();
  if (!reservations) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(reservations), {
    status: 200,
  });
};
