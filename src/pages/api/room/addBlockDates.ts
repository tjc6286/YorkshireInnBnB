import type { APIRoute } from "astro";
import { addBlockDates } from "../../../lib/rooms.js";
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  console.log("WORKING");
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const dates = data.dates;
    const roomId = data.roomId;

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await addBlockDates(roomId, dates);

    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
