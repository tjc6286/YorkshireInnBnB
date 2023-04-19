import type { APIRoute } from "astro";
import { getBookingByTransactionID } from "../../../lib/bookings";
import { getCustomerByID } from "../../../lib/customers";
import { logMessage } from "../../../lib/logger";
import { getMultipleReservations } from "../../../lib/reservations";

/**
 * API endpoint to get a booking by its transaction ID with the customer and reservation data.
 *
 * @param { request } holds the request object with incoming booking ID
 * @returns { Response } returns a Response object with the booking, customer, and reservation data
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    var bookingId = data.bookingId;

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/booking/bookingLookup",
      "Booking ID: " + bookingId
    );

    //Getting booking by transaction ID
    var booking = await getBookingByTransactionID(bookingId);

    //if no booking is found, return a 400
    if (!booking) {
      return new Response(null, { status: 400 });
    } else {
      //create an object holding the booking and customer data
      const customer = await getCustomerByID(booking.customerId);

      //get reservations
      const reservations = await getMultipleReservations(
        Object.values(booking.reservationIds)
      );

      //create return object
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
