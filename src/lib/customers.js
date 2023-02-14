import { CustomersCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllCustomers = async () => {
  const reviews = await (await CustomersCollection()).find({}).toArray();
  return reviews;
};
