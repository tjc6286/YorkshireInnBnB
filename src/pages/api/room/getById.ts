import { getRoomById } from "../../../lib/rooms";
import type { APIRoute } from "astro";

/**
 *
 * @returns
 */
export const get: APIRoute = async ({ request }) => {
  var data = await request.json();
  
  if (request.headers.get("Content-Type") === "application/json") {
    const id = data.id;
    console.log(id);
    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await getRoomById(id);
    console.log(room);
    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};