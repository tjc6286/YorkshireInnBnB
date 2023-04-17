import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import {
  getBookingByID,
  insertNewbooking,
  removeBookingByID,
  cancelBookingAndReservations,
} from "../../../lib/bookings";
import { insertNewCustomer } from "../../../lib/customers";
import { logMessage } from "../../../lib/logger";
import {
  cancelReservations,
  getReservationByID,
} from "../../../lib/reservations";

/**
 * API endpoint to cancel a booking and its reservations
 * @param { request } holds the request object with incoming booking ID
 * @returns { Response } returns a Response object with boolean value for success
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    let bookingId;
    try {
      bookingId = new ObjectId(data.bookingId);
    } catch (e) {
      console.error("Invalid ObjectId:", data.bookingId);
      return new Response(null, { status: 400 });
    }

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/booking/cancelBooking",
      "Booking ID: " + bookingId
    );
    var results = await cancelBookingAndReservations(bookingId);

    if (results) {
      return new Response(JSON.stringify({ results }), {
        status: 200,
      });
    }
  }
  return new Response(null, { status: 400 });
};
