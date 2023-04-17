import { getAllBookings } from "../../../lib/bookings";
import { logMessage } from "../../../lib/logger";

/**
 * Endpoint to get all bookings
 *
 * @returns {Response} Returns all bookings wrapped in a Response object
 */
export const get = async () => {
  //SERVER LOGGING

  logMessage("ENDPOINT: /api/booking/getAll", "Getting All Bookings");

  const bookings = await getAllBookings();
  if (!bookings) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(bookings), {
    status: 200,
  });
};
