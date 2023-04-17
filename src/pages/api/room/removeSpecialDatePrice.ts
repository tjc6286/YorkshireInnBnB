import type { APIRoute } from "astro";
import { logMessage } from "../../../lib/logger.js";
import { removeSpecialDatePrice } from "../../../lib/rooms.js";

/**
 * API endpoint to remove special date prices from a room.
 * @param { Request } request - Request object holding the room ID and date
 * @returns { Response } returns a Response object with boolean value for success
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const date = data.date;
    const roomId = data.roomId;

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/room/removeSpecialDatePrice",
      "Room ID: " + roomId
    );
    logMessage("ENDPOINT: /api/room/removeSpecialDatePrice", "Date: " + date);

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await removeSpecialDatePrice(roomId, date);

    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
