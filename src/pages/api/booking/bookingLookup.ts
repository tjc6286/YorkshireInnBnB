import type { APIRoute } from "astro";
import { getBookingByTransactionID } from "../../../lib/bookings";
import { getCustomerByID } from "../../../lib/customers";
import { logMessage } from "../../../lib/logger";
import { getMultipleReservations } from "../../../lib/reservations";

/**
 *
 * @param { request }
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    var bookingId = data.bookingId;

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/booking/bookingLookup",
      "Booking ID: " + bookingId,
    );

    var booking = await getBookingByTransactionID(bookingId);

    if (!booking) {
      return new Response(null, { status: 400 });
    } else {
      //create an object holding the booking and customer data
      const customer = await getCustomerByID(booking.customerId);
      //get reservations

      const reservations = await getMultipleReservations(
        Object.values(booking.reservationIds),
      );

      const retObj = {
        booking: booking,
        customer: customer,
        reservations: reservations,
      };

      return new Response(JSON.stringify(retObj), {
        status: 200,
      });
    }
  }
  return new Response(null, { status: 400 });
};
