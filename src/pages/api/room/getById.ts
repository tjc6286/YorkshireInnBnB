import { getRoomById } from "../../../lib/rooms";
import type { APIRoute } from "astro";

/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  
  if (request.headers.get("Content-Type") === "application/json") {
    const id = data.id;
    //VALIDATION FOR DATES, if NO DATES return ERROR MESSAGE
    const room = await getRoomById(id);
    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};