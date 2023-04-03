import type { APIRoute } from "astro";
import { addSpecialDatePrices } from "../../../lib/rooms.js";
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
    const price = data.price;

    //SERVER LOGGING
    console.log("ENDPOINT: /api/room/addSpecialDatePrice");
    console.log("Room ID: " + roomId);
    console.log("Dates: " + dates);
    console.log("Price: " + price);

    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await addSpecialDatePrices(roomId, price, dates);

    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
