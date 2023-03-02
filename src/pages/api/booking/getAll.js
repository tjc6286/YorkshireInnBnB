import { getAllBookings } from "../../../lib/bookings";

/**
 *
 * @returns
 */
export const get = async () => {
  console.log("LOG - Get ALL BOOKINGS");
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
