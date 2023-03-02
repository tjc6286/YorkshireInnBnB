import { getBookingByObject } from "../../../lib/bookings";

/**
 *
 * @returns
 */
export const get = async ({ params, request }) => {
  //THIS IS A BOOKING OBJ{} with the matching params inside
  //TODO: possible extract {lastName, confirmationNum}
  const incomingBooking = await request.json();
  console.log("LOG - Get ONE BOOKINGS");
  const bookings = await getBookingByObject(incomingBooking);
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
