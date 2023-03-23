// import { insertNewbooking } from "../../../lib/bookings";
// import { insertNewCustomer } from "../../../lib/customers";
// import { insertNewReservation } from "../../../lib/reservations";
import { bookingCreateTransaction } from "../../../lib/bookings";
import type { APIRoute } from "astro";
/**
 *
 * @param { request }
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();

    //TODO: Validate all customer | reservation | booking data coming in
    const res = bookingCreateTransaction(
      data.booking,
      data.customer,
      data.reservation
    );

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
