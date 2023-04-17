import { getRoomById } from "../../../lib/rooms";
import type { APIRoute } from "astro";

/**
 * API endpoint to get a room by id.
 *
 * @returns { Response } returns a Response object with the room data.
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
