import type { APIRoute } from "astro";
import { getRoomsAvailabilityByDateRange } from "../../../lib/rooms.js";
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const dates = data;

    //SERVER LOGGING
    console.log(
      "ENDPOINT: /api/room/getRoomAvailabilityByDateRange - " +
        new Date().toISOString
    );
    console.log("Dates: " + dates);

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    if (!dates) {
      return new Response("No dates provided", { status: 400 });
    }

    const room = await getRoomsAvailabilityByDateRange(dates);
    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
