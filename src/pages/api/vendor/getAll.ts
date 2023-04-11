import { logMessage } from "../../../lib/logger";
import { getAllVendors } from "../../../lib/vendors";
import type { APIRoute } from "astro";

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
