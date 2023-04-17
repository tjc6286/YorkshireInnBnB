import { countBookingSource } from "../../../lib/reporting";
import type { APIRoute } from "astro";

/**
 * API endpoint to get the booking source report.
 *
 * @returns { Response } returns a Response object with the booking source report information.
 */
export const get: APIRoute = async () => {
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
