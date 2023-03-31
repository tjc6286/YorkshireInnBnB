import { insertNewReservations } from "../../../lib/reservations";
import type { APIRoute } from "astro";

/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  //TODO: Validation
  //THIS IS A reservation OBJ{} with the matching params inside
  //TODO: possible extract {}
  var newReservation = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const reservation = await insertNewReservations(newReservation);
    return new Response(JSON.stringify(reservation), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
