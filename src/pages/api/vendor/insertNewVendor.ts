import { logMessage } from "../../../lib/logger";
import { createNewVendor } from "../../../lib/vendors";
import type { APIRoute } from "astro";

/**
 *
 * @returns
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
