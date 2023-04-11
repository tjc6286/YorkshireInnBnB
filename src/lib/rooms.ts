import { MongoClient, ObjectId } from "mongodb";
import type SpecialDatePrice from "../types/specialDatePrice";
import { logMessage } from "./logger";
import { RoomsCollection, disconnectDB } from "./mongodb";
/**
 * Method to get all rooms from the Rooms collection
 * @returns Array of room objects
 */
export const getAllRooms = async () => {
  //SERVER LOGGING
  logMessage("Method: getAllRooms", "Getting All Rooms");

  const rooms = await (await RoomsCollection()).find({}).toArray();
  // disconnectDB();
  return rooms;
};

/**
 * Method to get the Bolero room from the Rooms collection
 *
 * @returns Array containing the Bolero room object
 */
export const getBoleroRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: getBoleroRoom", "Getting Bolero Room");

  const rooms = await (await RoomsCollection())
    .find({ name: "Bolero" })
    .toArray();
  disconnectDB();
  return rooms;
};

/**
 * Method to get The Rose Suit room from the Rooms collection
 *
 * @returns Array containing The Rose Suit room object
 */
export const getRoseRoom = async () => {
  //SERVER LOGGING;
  logMessage("Method: getRoseRoom", "Getting Rose Room");

  const rooms = await (await RoomsCollection())
    .find({ name: "The Rose Suite" })
    .toArray();
  disconnectDB();
  return rooms;
};

/**
 * Method to get The Lodge Suit room from the Rooms collection
 *
 * @returns Array containing The Lodge Suit room object
 */
export const getLodgeRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: getLodgeRoom", "Getting Lodge Room");

  const rooms = await (await RoomsCollection())
    .find({ name: "Lodge Suite" })
    .toArray();
  disconnectDB();
  return rooms;
};

/**
 * Method to get The Blue room from the Rooms collection
 *
 * @returns Array containing The Blue room object
 */
export const getBlueRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: getBlueRoom", "Getting Blue Room");

  const rooms = await (await RoomsCollection())
    .find({ name: "Blue Room" })
    .toArray();
  disconnectDB();
  return rooms;
};

/**
 * Method to get the special price dates for a room from the Rooms collection by its ID.
 *
 * @param roomId ID of the room to get from the Rooms collection
 * @returns Array of special date price objects for the room id passed in.
 */
export const getSpecialDatePrice = async (roomId: string) => {
  //SERVER LOGGING
  logMessage(
    "Method: getSpecialDatePrice",
    "Getting Special Date Price for Room ID: " + roomId
  );

  const room = await (await RoomsCollection())
    .find({ _id: new ObjectId(roomId) })
    .toArray();
  disconnectDB();
  return room[0].specialPriceDates;
};

/**
 * Method to get a room by its ID from the Rooms collection.
 *
 * @param roomId ID of the room to get from the Rooms collection
 * @returns Room object
 */
export const getRoomById = async (roomId: string) => {
  //SERVER LOGGING
  logMessage("Method: getRoomById", "Getting Room by ID: " + roomId);

  const room = await (await RoomsCollection())
    .find({ _id: new ObjectId(roomId) })
    .toArray();
  disconnectDB();
  return room;
};

/**
 * Method to get an array of rooms based on their availability based on a dates passed in.
 * @param dateArray Array of dates to check for availability
 * @returns Array of room objects
 */
export const getRoomsAvailabilityByDateRange = async (
  dateArray: Array<string>
) => {
  const client = new MongoClient(
    process.env.MONGODB_URI || import.meta.env.MONGODB_URI,
    {}
  );
  console.log("dateArray: ", dateArray);
  try {
    //SERVER LOGGING
    logMessage(
      "Method: getRoomsAvailabilityByDateRange",
      "Getting Rooms Availability by Date Range: " + dateArray
    );
    await client.connect();
    //logBlue("[Connecting to DB] - " + new Date().toLocaleTimeString());
    const db = client.db(
      process.env.MONGODB_NAME || import.meta.env.MONGODB_NAME
    );

    //if dateArray has more than one element, remove the last element.
    // const dates =
    //   dateArray?.length > 1
    //     ? dateArray.slice(0, dateArray?.length - 1)
    //     : dateArray;

    const pipeline = [
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          priceRange: 1,
          specialPriceDates: 1,
          basePrice: 1,
          maximumOccupancy: 1,
          imgPathName: 1,
          bookedDates: 1,
          unavailableDates: 1,
          temporaryHoldDates: 1,
          isAvailable: {
            $not: {
              $anyElementTrue: {
                $map: {
                  input: dateArray,
                  as: "date",
                  in: {
                    $or: [
                      { $in: ["$$date", "$bookedDates"] },
                      { $in: ["$$date", "$unavailableDates"] },
                      { $in: ["$$date", "$temporaryHoldDates"] },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    ];

    const roomsCollection = await db.collection("Room");
    const rooms = await roomsCollection.aggregate(pipeline).toArray();
    return rooms;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error getting Rooms Availability by Date Range : ${error})}}`
    );
  } finally {
    await client.close();
  }
};

/**
 * Method to add an array of dates to a room's temporaryHoldDates array.
 * @param roomId ID of the room to add the dates to
 * @param dateArray Array of dates to add to the room's temporaryHoldDates array
 * @returns Boolean indicating success or failure
 */
export const addHoldDates = async (
  roomId: string | Array<string>,
  dateArray: Array<string>
) => {
  //SERVER LOGGING
  logMessage("Method: addHoldDates", "Adding Hold Dates to Room ID: " + roomId);
  logMessage("Method: addHoldDates", "Dates to Add: " + dateArray);

  const roomsCollection = await RoomsCollection();

  try {
    if (roomId instanceof Array) {
      //write an updateMany query to update all the rooms
      const objs = roomId.map((id) => new ObjectId(id));
      console.log(objs, "about to update");
      await roomsCollection.updateMany(
        { _id: { $in: objs } },
        {
          $push: { temporaryHoldDates: { $each: dateArray } },
        }
      );
    } else {
      await roomsCollection.updateOne(
        { _id: roomId[0] },
        {
          $push: { temporaryHoldDates: { $each: dateArray } },
        }
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    disconnectDB();
  }

  return true;
};

/**
 * Method to add an array of dates to a room's unavailableDates array.
 * @param roomId ID of the room to add the dates to
 * @param dateArray Array of dates to add to the room's unavailableDates array
 * @returns Boolean indicating success or failure
 */
export const addBlockDates = async (
  roomId: string | Array<string>,
  dateArray: Array<string>
) => {
  //SERVER LOGGING
  logMessage(
    "Method: addBlockDates",
    "Adding Block Dates to Room ID: " + roomId
  );
  logMessage("Method: addBlockDates", "Dates to Add: " + dateArray);

  const roomsCollection = await RoomsCollection();
  try {
    if (roomId instanceof Array) {
      //write an updateMany query to update all the rooms
      const objs = roomId.map((id) => new ObjectId(id));
      //console.log(objs, "about to update");
      await roomsCollection.updateMany(
        { _id: { $in: objs } },
        {
          $push: { unavailableDates: { $each: dateArray } },
        }
      );
    } else {
      //console.log(roomId, "about to update");
      await roomsCollection.updateOne(
        { _id: new ObjectId(roomId) },
        {
          $push: { unavailableDates: { $each: dateArray } },
        }
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    disconnectDB();
  }

  return true;
};

/**
 * Method to removea date from a room's unavailableDates array.
 *
 * @param roomId ID of the room to remove the date from
 * @param date Date to remove from the room's unavailableDates array
 * @returns Boolean indicating success or failure
 */
export const removeBlockDate = async (roomId: string, date: string) => {
  //SERVER LOGGING
  logMessage(
    "Method: removeBlockDate",
    "Removing Block Date from Room ID: " + roomId
  );
  logMessage("Method: removeBlockDate", "Date to Remove: " + date);

  const roomsCollection = await RoomsCollection();
  // check if roomId is a valid ObjectId
  if (!ObjectId.isValid(roomId)) {
    console.log(`Invalid ObjectId: ${roomId}`);
    return false;
  }

  try {
    await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $pull: { unavailableDates: date } }
    );
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    disconnectDB();
  }
  return true;
};

/**
 * Method to add a SpecialDatePrice object to a room's specialPriceDates array.
 *
 * @param roomId ID of the room to add the SpecialDatePrice object to
 * @param updatedPrice Price to update the room to
 * @param dates Array of dates to add to the room's specialPriceDates array
 * @returns Boolean indicating success or failure
 */
export const addSpecialDatePrices = async (
  roomId: string,
  updatedPrice: number,
  dates: string[]
) => {
  //SERVER LOGGING
  logMessage(
    "Method: addSpecialDatePrices",
    "Adding Special Date Prices to Room ID: " + roomId
  );
  logMessage("Method: addSpecialDatePrices", "Updated Price: " + updatedPrice);
  logMessage("Method: addSpecialDatePrices", "Dates to Add: " + dates);

  const roomsCollection = await RoomsCollection();

  try {
    const specialDatePrices: SpecialDatePrice[] = dates.map((date) => ({
      date,
      price: updatedPrice,
    }));

    await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $push: { specialPriceDates: { $each: specialDatePrices } } }
    );

    console.log(`Added special date prices for room with ID: ${roomId}`);
  } catch (error) {
    console.error("Error adding special date prices", error);
  } finally {
    disconnectDB();
  }
};

/**
 * Method to remove a SpecialDatePrice object from a room's specialPriceDates array by a given date.
 *
 * @param roomId ID of the room to remove the SpecialDatePrice object from
 * @param dateToRemove Date to remove from the room's specialPriceDates array
 * @returns Boolean indicating success or failure
 */
export const removeSpecialDatePrice = async (
  roomId: string,
  dateToRemove: string
) => {
  //SERVER LOGGING
  logMessage(
    "Method: removeSpecialDatePrice",
    "Removing Special Date Price from Room ID: " + roomId
  );
  logMessage(
    "Method: removeSpecialDatePrice",
    "Date to Remove: " + dateToRemove
  );

  const roomsCollection = await RoomsCollection();

  try {
    const result = await roomsCollection.findOneAndUpdate(
      { _id: new ObjectId(roomId) },
      { $pull: { specialPriceDates: { date: dateToRemove } } },
      { returnDocument: "after" }
    );

    console.log(
      `Removed special date price for ${dateToRemove} in room with ID: ${roomId}`
    );

    return result.value;
  } catch (error) {
    console.error("Error removing special date price", error);
    return null;
  } finally {
    disconnectDB();
  }
};
