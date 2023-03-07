import type { Customer } from "../types/customer";
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
 * @param newCustomer 
 * @returns 
 */
export const insertNewCustomer = async (newCustomer:Customer) => {
  const customers = await CustomersCollection();
  return customers.insert(newCustomer);
};

/**
 * 
 * @param customer 
 * @param updateCustomer 
 * @returns 
 */
export const updateCustomer = async (customer: Customer, updateCustomer: Customer) => {
  const customers = await CustomersCollection();
  return customers.update(customer, updateCustomer);
};
