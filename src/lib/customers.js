import { CustomersCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllCustomers = async () => {
  const reviews = await (await CustomersCollection()).find({}).toArray();
  return reviews;
};

/**
 *
 * @returns
 */
export const insertNewCustomer = async (newCustomer) => {
  const customers = await CustomersCollection();
  return customers.insert(newCustomer);
};

/**
 *
 * @param {customer}
 * @param {updatedCustomer}
 * @returns
 */
export const updateCustomer = async (customer, updateCustomer) => {
  const customers = await CustomersCollection();
  return customers.update(customer, updateCustomer);
};
