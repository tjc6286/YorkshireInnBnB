import { insertNewCustomer } from "../../../lib/customers";
import type { APIRoute } from "astro";

/**
 * API endpoint to add a new customer to the database.
 *
 * @returns { Response } returns a Response object with the new customer data
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const newCustomer = data;
    const customer = await insertNewCustomer(newCustomer);
    return new Response(JSON.stringify(customer), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
