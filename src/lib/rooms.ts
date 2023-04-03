import { ObjectId } from "mongodb";
import isDateInArray from "../helpers/isDateInArray";
import type { RoomAvailability } from "../types/room";
import type SpecialDatePrice from "../types/specialDatePrice";
import { RoomsCollection, disconnectDB } from "./mongodb";

/**
 * Method to get all rooms from the Rooms collection
 * @returns Array of room objects
 */
export const getAllRooms = async () => {
  const rooms = await (await RoomsCollection()).find({}).toArray();
  disconnectDB();
  return rooms;
};

/**
 * Method to get the Bolero room from the Rooms collection
 *
 * @returns Array containing the Bolero room object
 */
export const getBoleroRoom = async () => {
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
  let formattedDates: Array<Date> = [];
  dateArray.forEach((date) => {
    formattedDates.push(new Date(date));
  });

  const rooms = await (await RoomsCollection()).find({}).toArray();

  rooms.forEach((room: RoomAvailability) => {
    let dateFound = false;
    formattedDates.forEach((date: Date) => {
      if (
        isDateInArray(room.temporaryHoldDates, date) ||
        isDateInArray(room.unavailableDates, date)
      ) {
        dateFound = true;
      }
    });

    if (dateFound) {
      room.isAvailable = false;
      return;
    } else {
      room.isAvailable = true;
    }
  });
  disconnectDB();
  return rooms;
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
  }
  disconnectDB();
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
  const roomsCollection = await RoomsCollection();
  console.log(roomId, dateArray, "in addBlockDates");
  try {
    if (roomId instanceof Array) {
      //write an updateMany query to update all the rooms
      const objs = roomId.map((id) => new ObjectId(id));
      console.log(objs, "about to update");
      await roomsCollection.updateMany(
        { _id: { $in: objs } },
        {
          $push: { unavailableDates: { $each: dateArray } },
        }
      );
    } else {
      console.log(roomId, "about to update");
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

//given a date: string and a roomId remove the date from the unavailableDates array
export const removeBlockDate = async (roomId: string, date: string) => {
  const roomsCollection = await RoomsCollection();
  //console.log(roomId, "room ID");
  // check if roomId is a valid ObjectId
  if (!ObjectId.isValid(roomId)) {
    console.log(`Invalid ObjectId: ${roomId}`);
    return false;
  }

  // remove the given date from the unavailableDates array in the room with the given roomId
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
