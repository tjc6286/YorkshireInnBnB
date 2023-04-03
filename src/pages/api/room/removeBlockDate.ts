import type { APIRoute } from "astro";
import { removeBlockDate } from "../../../lib/rooms.js";
import { logMessage } from "../../../lib/logger.js";
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  console.log("WORKING");
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
