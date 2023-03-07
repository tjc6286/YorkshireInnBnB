import { ObjectId } from "mongodb";
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
  // For customer: check if customer already exisits using the email
  const customers = await CustomersCollection();
  return customers.insert(newCustomer);
};

/**
 * 
 * @param customer 
 * @param updateCustomer 
 * @returns 
 */
export const updateCustomer = async (customerID: string, updateCustomer: Customer) => {
  const customers = await CustomersCollection();
  return customers.update({_id: new ObjectId(customerID)}, updateCustomer);
};
