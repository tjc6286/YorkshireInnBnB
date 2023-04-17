import { logMessage } from "../../../lib/logger";
import { getAllVendors } from "../../../lib/vendors";
import type { APIRoute } from "astro";

/**
 * API endpoint to get all vendors.
 * @returns { Response } returns a Response object with all vendors.
 */
export const get: APIRoute = async ({ params }) => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/vendor/getAll", "Getting All Vendors");

  const vendors = await getAllVendors();
  if (!vendors) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(vendors), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
