import type { APIRoute } from "astro";
import { getInProcessBookingByID } from "../../../lib/bookings";
/**
 *
 * @param { request }
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var id = await request.json();

    //SERVER LOGGING
    console.log(
      "ENDPOINT: /api/booking/getInProcessBookingById - " +
        new Date().toISOString()
    );
    console.log("InProcessBooking ID: " + id);

    //TODO: Validate all customer | reservation | booking data coming in
    const res = await getInProcessBookingByID(id);

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
