import { logMessage } from "../../../lib/logger";
import { createNewVendor } from "../../../lib/vendors";
import type { APIRoute } from "astro";

/**
 * API endpoint to create a new vendor.
 *
 * @param { Request } request - the request object holding the vendor name.
 * @returns { Response } returns a Response object with the Inserted ID for the new vendor.
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    var newVendorName = data.vendorName;

    //SERVER LOGGING
    logMessage(
      "ENDPOINT: /api/vendor/insertNewVendor",
      "Creating New Vendor: " + newVendorName
    );

    const newVendor = await createNewVendor(newVendorName);
    return new Response(JSON.stringify(newVendor), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
