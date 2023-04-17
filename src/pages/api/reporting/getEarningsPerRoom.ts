import { sumTotalPerRoom } from "../../../lib/reporting";
import type { APIRoute } from "astro";

/**
 * API endpoint to get the earnings per room report.
 *
 * @returns { Response } returns a Response object with the earnings per room report information.
 */
export const get: APIRoute = async () => {
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
