import { getAllBookings } from "../../../lib/bookings";

/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  console.log("Endpoint: /api/booking/getAll - " + new Date().toISOString());

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
