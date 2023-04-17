import type { APIRoute } from "astro";
import { logMessage } from "../../../lib/logger.js";
import { getRoomsAvailabilityByDateRange } from "../../../lib/rooms.js";

/**
 * API endpoint to get room availability by date range.
 *
 * @param { Request } request - Request object holding the date range
 * @returns { Response } returns a Response with all rooms that are available for the date range
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const dates = data.dateRange;
    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/room/getRoomAvailabilityByDateRange",
      "Getting Rooms avialble for Dates: " + dates
    );

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
