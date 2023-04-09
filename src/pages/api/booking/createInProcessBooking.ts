import type { APIRoute } from "astro";
import { insertNewInProcessBooking } from "../../../lib/bookings";

/**
 * This API route is used to create a new InProcessBooking in the database
 * to help pass along the data in the checkout flow.
 *
 * @param { request } holds the data coming in from the client
 * - startDate: Date
 * - endDate: Date
 * - itinerary : Array of Room Objects
 * @returns send back the new InProcessBooking ObjectID
 **/
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();

    const res = await insertNewInProcessBooking(data);

    if (!res) {
      return new Response(null, { status: 400 });
    }

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
