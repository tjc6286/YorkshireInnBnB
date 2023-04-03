import type { APIRoute } from "astro";
import { addHoldDates } from "../../../lib/rooms.js";

/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const roomId = data.roomId;
    const dates = data.dates;

    //SERVER LOGGING
    console.log("ENDPOINT: /api/room/addHoldDates");
    console.log("Room ID: " + roomId);
    console.log("Dates: " + dates);

    //VALIDATION NEEDED
    const room = await addHoldDates(roomId, dates);
    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
