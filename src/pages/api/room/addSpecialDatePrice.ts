import type { APIRoute } from "astro";
import { addSpecialDatePrices } from "../../../lib/rooms.js";
import { logMessage } from "../../../lib/logger.js";
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const dates = data.dates;
    const roomId = data.roomId;
    const price = data.price;

    //SERVER LOGGING
    logMessage("ENDPOINT: /api/room/addSpecialDatePrice", "Room ID: " + roomId);
    logMessage("ENDPOINT: /api/room/addSpecialDatePrice", "Dates: " + dates);
    logMessage("ENDPOINT: /api/room/addSpecialDatePrice", "Price: " + price);

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await addSpecialDatePrices(roomId, price, dates);

    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
