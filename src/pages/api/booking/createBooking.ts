import { insertNewbooking } from "../../../lib/bookings";
import { insertNewCustomer } from "../../../lib/customers";
import { insertNewReservation } from "../../../lib/reservations";
import type { APIRoute } from 'astro';
/**
 * 
 * @param { request } 
 * @returns 
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();

    //TODO: Validate all customer | reservation | booking data coming in
    const customer = await insertNewCustomer(data.customer);
    const reservation = await insertNewReservation(data.reservation);
    const booking = await insertNewbooking(data.booking);

    const res = {
      customer: customer,
      reservation: reservation,
      booking: booking
    }

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
}