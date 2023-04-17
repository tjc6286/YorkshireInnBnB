import type { APIRoute } from "astro";
import { removeBlockDate } from "../../../lib/rooms.js";
import { logMessage } from "../../../lib/logger.js";

/**
 * API endpoint to remove block dates from a room.
 *
 * @param { Request } request - Request object holding the room ID and dates
 * @returns { Response } returns a Response object with boolean value for success
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const roomId = data.roomId;
    const dates = data.date;

    //SERVER LOGGING
    logMessage("ENDPOINT: /api/room/removeBlockDate", "Room ID: " + roomId);
    logMessage("ENDPOINT: /api/room/removeBlockDate", "Dates: " + dates);

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const success = await removeBlockDate(roomId, dates);

    return new Response(JSON.stringify(success), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
