import { sumTotalPerRoom } from "../../../lib/reporting";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params }) => {
  const earningsPerRoom = await sumTotalPerRoom();
  if (!earningsPerRoom) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(earningsPerRoom), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
