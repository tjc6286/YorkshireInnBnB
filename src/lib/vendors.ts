import { v4 as uuidv4 } from "uuid";
import { logMessage } from "./logger";
import { VendorsCollection, disconnectDB } from "./mongodb";

export const getAllVendors = async () => {
  try {
    //SERVER LOGGING
    logMessage("Method: getAllVendors", "Getting All Vendors");

    const vendors = await (await VendorsCollection()).find({}).toArray();
    return vendors;
  } finally {
    disconnectDB();
  }
};

export const createNewVendor = async (newVendorName: string) => {
  try {
    //SERVER LOGGING
    logMessage(
      "Method: createNewVendor",
      "Creating New Vendor: " + newVendorName,
    );

    const vendorCollection = await VendorsCollection();

    const newVendor = {
      vendorName: newVendorName,
      vendorKey: uuidv4(),
    };

    const vendors = await VendorsCollection();
    const result = await vendorCollection.insertOne(newVendor);
    return result.insertedId;
  } finally {
    disconnectDB();
  }
};

export const checkVendorExists = async (vendorKey: string) => {
  try {
    //SERVER LOGGING
    logMessage("Method: checkVendorExists", "Checking Vendor: " + vendorKey);

    const vendorCollection = await VendorsCollection();

    const res = vendorCollection.findOne({ vendorKey: vendorKey });
    console.log(res);
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking vendor:", error);
    return false;
  }
};

export const removeVendor = async (vendorKey: string) => {
  try {
    //SERVER LOGGING
    logMessage("Method: removeVendor", "Removing Vendor: " + vendorKey);

    const vendorCollection = await VendorsCollection();

    const result = await vendorCollection.deleteOne({ vendorKey: vendorKey });

    if (result.deletedCount === 1) {
      console.log(`Vendor with vendorKey "${vendorKey}" successfully removed.`);
    } else {
      console.log(`No vendor found with vendorKey "${vendorKey}".`);
    }
    return true;
  } catch (error) {
    console.error("Error removing vendor:", error);
    return false;
  } finally {
    disconnectDB();
  }
};
