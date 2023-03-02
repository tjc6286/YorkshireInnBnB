import { insertNewCustomer } from "../../../lib/customers";
import type { APIRoute } from 'astro';
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const newCustomer = data;
    const room = await insertNewCustomer(newCustomer);
    return new Response(JSON.stringify(room), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
}

