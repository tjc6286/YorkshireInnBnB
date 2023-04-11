import type { APIRoute } from "astro";
import { createVendorBooking } from "../../../lib/bookings";
import { checkVendorExists } from "../../../lib/vendors";

/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();

    const vendorExists = await checkVendorExists(data.vendorKey);

    if (!vendorExists) {
      return new Response(JSON.stringify({ message: "Invalid Key" }), {
        status: 401,
      });
    }

    const successfulOperation: any = await createVendorBooking(data);

    if (successfulOperation.error) {
      return new Response(JSON.stringify(successfulOperation.message), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(successfulOperation.confirmationCode), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
