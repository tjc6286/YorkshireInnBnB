import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import {
  cancelBooking,
  getBookingByID,
  insertNewbooking,
  removeBookingByID,
} from "../../../lib/bookings";
import { insertNewCustomer } from "../../../lib/customers";
import { logMessage } from "../../../lib/logger";
import {
  cancelReservations,
  getReservationByID,
} from "../../../lib/reservations";

/**
 *
 * @param { request }
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    var bookingId = new ObjectId(data.bookingId);

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/booking/cancelBooking",
      "Booking ID: " + bookingId
    );

    var booking = await getBookingByID(bookingId);

    if (!booking) {
      return new Response(null, { status: 400 });
    } else {
      const reservations = [];
      for (const [key, value] of Object.entries(booking.reservationIds)) {
        const reservation = await getReservationByID(value);
        reservations.push(reservation);
      }
      await cancelReservations(reservations);
      var deletedBooking = await cancelBooking(bookingId);

      if (deletedBooking === undefined) {
        return new Response(null, { status: 400 });
      }
      return new Response(JSON.stringify({ deletedBooking }), {
        status: 200,
      });
    }
  }
  return new Response(null, { status: 400 });
};
