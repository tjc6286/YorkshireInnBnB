import {getRoomsAvailabilityByDateRange} from "../../../lib/rooms.js"
import type { APIRoute } from 'astro';
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const dates = data.dates;

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE 

    const room = await getRoomsAvailabilityByDateRange(dates);
    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
}
