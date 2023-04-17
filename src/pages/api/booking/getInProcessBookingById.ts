import type { APIRoute } from "astro";
import { getInProcessBookingByID } from "../../../lib/bookings";
import { logMessage } from "../../../lib/logger";

/**
 * API endpoint to get an in process booking by its ID.
 *
 * @param { request } holds the request object with incoming booking ID
 * @returns { Response } returns a Response object with the InProcessBooking data
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var id = await request.json();

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/booking/getInProcessBookingById",
      "Getting InProcessBooking ID: " + id
    );

    //TODO: Validate all customer | reservation | booking data coming in
    const res = await getInProcessBookingByID(id);

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
