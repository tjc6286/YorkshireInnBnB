import { countBookingSource } from "../../../lib/reporting";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params }) => {
  const bookingSource = await countBookingSource();
  if (!bookingSource) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(bookingSource), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
