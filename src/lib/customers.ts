import { ObjectId } from "mongodb";
import type { Customer } from "../types/customer";
import { CustomersCollection, disconnectDB } from "./mongodb";
import { logYellow, logBlue, logRed, logMessage } from "./logger";
/**
 * Method to get all customers from the Customers collection
 *
 * @returns Array of customer objects
 */
export const getAllCustomers = async () => {
  //SERVER LOGGING
  logMessage("Method: getAllCustomers", "Getting All Customers");

  const reviews = await (await CustomersCollection()).find({}).toArray();
  return reviews;
};

//get customer by id
export const getCustomerByID = async (customerID: string) => {
  //SERVER LOGGING
  logMessage(
    "Method: getCustomerByID",
    "Getting Customer by ID: " + customerID
  );

  const customers = await (await CustomersCollection())
    .find({ _id: new ObjectId(customerID) })
    .toArray();
  disconnectDB();
  return customers[0];
};

/**
 * Method to insert a new customer into the Customers collection.
 *
 * @param customerID ID of the customer to get from the Customers collection
 * @returns Customer object
 */
export const insertNewCustomer = async (newCustomer: Customer) => {
  //SERVER LOGGING
  logMessage(
    "Method: insertNewCustomer",
    "Inserting New Customer:" + newCustomer
  );

  const customers = await CustomersCollection();
  const res = await customers.insertOne(newCustomer);
  disconnectDB();
  return res.insertedId;
};

/**
 * Method to get a customer by its ID from the Customers collection.
 *
 * @param customerID ID of the customer to get from the Customers collection
 * @returns Customer object
 */
export const updateCustomer = async (
  customerID: string,
  updateCustomer: Customer
) => {
  //SERVER LOGGING
  logMessage(
    "Method: updateCustomer",
    "Updating Customer by ID: " + customerID
  );
  logMessage(
    "Method: updateCustomer",
    "Updating Customer with: " + updateCustomer
  );

  const customers = await CustomersCollection();
  const updatedCustomer = customers.update(
    { _id: new ObjectId(customerID) },
    updateCustomer
  );
  disconnectDB();
  return updatedCustomer;
};
