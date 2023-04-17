import type { APIRoute } from "astro";
import { addBlockDates } from "../../../lib/rooms.js";
import { logMessage } from "../../../lib/logger.js";

/**
 * API endpoint to add block dates to a room
 * @returns { Response } returns a Response object with boolean value for success
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const dates = data.dates;
    const roomId = data.roomId;

    //SERVER LOGGING
    logMessage("ENDPOINT: /api/room/addBlockDates", "Room ID: " + roomId);
    logMessage("ENDPOINT: /api/room/addBlockDates", "Dates: " + dates);

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await addBlockDates(roomId, dates);

    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
