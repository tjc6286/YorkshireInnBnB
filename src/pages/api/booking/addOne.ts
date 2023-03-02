import { insertNewbooking } from "../../../lib/bookings";
import type { APIRoute } from 'astro';
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  //TODO: Validation
  //THIS IS A BOOKING OBJ{} with the matching params inside
  //TODO: possible extract {lastName, confirmationNum}
  var newBooking = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const booking = await insertNewbooking(newBooking);
    return new Response(JSON.stringify(booking), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
}


