import { getAllBookingsWithCustomerAndReservation } from "../../../lib/bookings";
import { logMessage } from "../../../lib/logger";
/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/booking/getAllAdmin", "Getting All Bookings");

  const bookingList = await getAllBookingsWithCustomerAndReservation();
  // console.log(bookingList[0].reservations);

  return new Response(JSON.stringify(bookingList), {
    status: 200,
  });
};
