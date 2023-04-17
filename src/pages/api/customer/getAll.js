import { getAllCustomers } from "../../../lib/customers";

/**
 * Endpoint to get all customers
 * @returns {Response} Returns all customers wrapped in a Response object
 */
export const get = async () => {
  console.log("Log - GET ALL CUSTOMERS");
  const customers = await getAllCustomers();
  if (!customers) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(customers), {
    status: 200,
  });
};
