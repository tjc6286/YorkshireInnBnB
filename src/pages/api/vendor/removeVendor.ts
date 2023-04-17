import { logMessage } from "../../../lib/logger";
import { removeVendor } from "../../../lib/vendors";
import type { APIRoute } from "astro";

/**
 * API endpoint to remove a vendor.
 *
 * @param { Request } request - the request object holding the vendor key to remove.
 * @returns { Response } returns a Response object with the boolean value for success.
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    var vendorKey = data.vendorKey;

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/vendor/removeVendor",
      "Removing Vendor: " + vendorKey
    );

    const deleted = await removeVendor(vendorKey);
    if (!deleted) {
      return new Response(null, { status: 500 });
    }

    return new Response(JSON.stringify(deleted), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
