import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import {
  getBookingByID,
  insertNewbooking,
  removeBookingByID,
} from "../../../lib/bookings";
import { insertNewCustomer } from "../../../lib/customers";
import {
  cancelReservations,
  insertNewReservations,
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
    var booking = await getBookingByID(bookingId);
    if (!booking) {
      return new Response(null, { status: 400 });
    } else {
      await cancelReservations(booking.reservationIds);
      var deletedBooking = await removeBookingByID(bookingId);
      return new Response(JSON.stringify({ deletedBooking }), {
        status: 200,
      });
    }
    return new Response(null, { status: 400 });
  }
};
