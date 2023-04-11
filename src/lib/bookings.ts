import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import type { IFormState } from "../components/organisms/customerInformationForm/CustomerInformationForm";
import type { Booking } from "../types/Booking";
import type VendorBooking from "../types/VendorBooking";
import { logBlue, logMessage, logYellow } from "./logger";
import {
  BookingsCollection,
  CustomersCollection,
  InProcessBookingCollection,
  ReservationsCollection,
  RoomsCollection,
  disconnectDB,
} from "./mongodb";

/**
 * Method to get all bookings from the Bookings collection
 * @returns Array of Booking objects
 */
export const getAllBookings = async () => {
  //SERVER LOGGING
  logMessage("Method: getAllBookings", "Getting All Bookings");
  const bookings = await (await BookingsCollection()).find({}).toArray();
  disconnectDB();
  return bookings;
};

/**
 * Method to get a booking by its ID from the Bookings collection.
 * @param bookingId ID of the Booking to get from the Bookings collection
 * @returns Booking object
 */
export const getBookingByID = async (bookingId: ObjectId) => {
  //SERVER LOGGING
  logMessage("Method: getBookingByID", "Getting Booking by ID: " + bookingId);

  const bookings = await (await BookingsCollection())
    .find({ _id: bookingId })
    .toArray();
  disconnectDB();
  return bookings[0];
};

export const getBookingByTransactionID = async (bookingId: string) => {
  //SERVER LOGGING
  logMessage("Method: getBookingByID", "Getting Booking by ID: " + bookingId);

  const bookings = await (await BookingsCollection())
    .find({ transactionId: bookingId })
    .toArray();
  disconnectDB();
  return bookings[0];
};

/**
 * Method to get booking by its id and returning the booking, customer, and reservations attached to it.
 *
 * @param bookingId ID of the Booking to get from the Bookings collection
 * @returns Object containing the Booking, Customer, and Reservations
 */
export const bookingLookup = async (bookingId: string) => {
  //SERVER LOGGING
  logMessage("Method: bookingLookup", "Getting Booking by ID: " + bookingId);

  const bookings = await (await BookingsCollection())
    .find({ _id: new ObjectId(bookingId) })
    .toArray();

  const customer = await (await CustomersCollection())
    .find({ _id: new ObjectId(bookings[0].customerID) })
    .toArray();

  const reservations = await (await ReservationsCollection())
    .find({ _id: { $in: bookings[0].reservationIDs } })
    .toArray();

  //create object to return using the booking, customer, and reservations
  const bookingReturn = {
    booking: bookings[0],
    customer: customer[0],
    reservations: reservations,
  };
  disconnectDB();
  return bookingReturn;
};

/**
 * Method to insert a new booking into the Bookings collection.
 * @param newBooking Booking object to insert into the Bookings collection
 * @returns insertedId of the Booking Object inserted into the Bookings collection
 */
export const insertNewbooking = async (newBooking: any) => {
  //SERVER LOGGING
  logMessage("Method: insertNewbooking", "Inserting New Booking" + newBooking);

  const bookingcollection = await BookingsCollection();

  const insertedBooking = await bookingcollection.insertOne(newBooking);
  disconnectDB();
  return insertedBooking.insertedId;
};

/**
 * Method to update a booking by its ID and update it with the updatedBooking object.
 * @param bookingID ID of the Booking to update
 * @param updatedBooking Updated Booking object
 * @returns Booking object
 */
export const updateBooking = async (
  bookingID: string,
  updatedBooking: Booking
) => {
  //SERVER LOGGING
  logMessage("Method: updateBooking", "Updating Booking by ID: " + bookingID);
  logMessage("Method: updateBooking", "Updated Booking: " + updatedBooking);

  const bookingcollection = await BookingsCollection();
  const returnBooking = await bookingcollection.update(
    { _id: new ObjectId(bookingID) },
    updatedBooking
  );
  disconnectDB();
  return returnBooking;
};

/**
 * Inserts a new InProcessBooking into the InProcessBooking collection.
 *
 * @param {newbooking} new InProcessBooking to insert into the InProcessBooking collection
 * @returns {bookingID} the ID of the booking that was inserted
 */
export const insertNewInProcessBooking = async (newBooking: any) => {
  //SERVER LOGGING
  logMessage(
    "Method: insertNewInProcessBooking",
    "Inserting New Booking Obj:" + newBooking
  );

  const bookingcollection = await InProcessBookingCollection();
  //TODO: validate the information
  try {
    const result = await bookingcollection.insertOne(newBooking);
    return result.insertedId;
  } catch (e) {
    console.log("Error: Problem inserting temporary booking: " + newBooking);
  } finally {
    disconnectDB();
  }
};

/**
 * Inserts a new InProcessBooking into the InProcessBooking collection.
 *
 * @param {newbooking} id Id of the current in process booking
 *
 * @returns {bookingID} the ID of the booking that was inserted
 */
export const updateInProcessBooking = async (
  id: string,
  amount: number,
  totalCost: number,
  customerInformation: IFormState,
  blockedOffDates: Array<string>
) => {
  //SERVER LOGGING
  logMessage(
    "Method: updateInProcessBooking",
    "Updating inProgressBooking Obj: " + id
  );

  const bookingcollection = await InProcessBookingCollection();
  //TODO: validate the information
  try {
    const result = await bookingcollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount: amount,
          totalCost: totalCost,
          customerInformation: customerInformation,
          blockedOffDates: blockedOffDates,
        },
      }
    );
    return result.acknowledged;
  } catch (e) {
    console.log("Error: Problem inserting temporary booking: " + id);
  } finally {
    disconnectDB();
  }
};

/**
 * Gets a InProcessBooking by its ID
 *
 * @param bookingId ID of the InProcessBooking to get
 * @returns InProcessBooking object
 */
export const getInProcessBookingByID = async (bookingId: string) => {
  //SERVER LOGGING
  logMessage(
    "Method: getInProcessBookingByID",
    "Getting InProcessBooking by ID: " + bookingId
  );

  //TODO: add the correct parameters to the find
  const inProcessBookings = await (await InProcessBookingCollection())
    .find({ _id: new ObjectId(bookingId) })
    .toArray();

  disconnectDB();
  return inProcessBookings[0];
};

/**
 * Remove a Booking by the passed in ID.
 *
 * @param bookingId ID of the Booking to remove
 * @returns Booking object
 */
export const removeBookingByID = async (bookingId: ObjectId) => {
  //SERVER LOGGING
  logMessage(
    "Method: removeBookingByID",
    "Removing Booking by ID: " + bookingId
  );

  const bookingcollection = await BookingsCollection();
  const result = await bookingcollection.findOneAndDelete({ _id: bookingId });

  // result.value contains the deleted document or null if no document was found
  disconnectDB();
  return result.value;
};

/**
 *  Method to Cancel a Booking and all of its Reservations, and
 *  removing the rooms bookd dates by given a Booking ID.
 *
 * @param bookingId ID of the Booking to cancel
 * @returns Boolean value indicating if the Booking was cancelled successfully
 */
export const cancelBookingAndReservations = async (bookingId: ObjectId) => {
  const client = new MongoClient(
    process.env.MONGODB_URI || import.meta.env.MONGODB_URI,
    {}
  );

  try {
    //SERVER LOGGING
    logMessage(
      "Method: cancelBookingAndReservations",
      "Cancelling Booking by ID: " + bookingId
    );

    await client.connect();
    logBlue("[Connecting to DB] - " + new Date().toLocaleTimeString());
    const db = client.db(
      process.env.MONGODB_NAME || import.meta.env.MONGODB_NAME
    );
    const bookingcollection = db.collection("Booking");
    const reservationcollection = db.collection("RoomReservation");
    const roomCollection = db.collection("Room");

    const booking = await bookingcollection.findOne({ _id: bookingId });

    if (booking) {
      // Retrieve reservations and update the isCancelled field to true
      const reservations = await reservationcollection
        .find({ _id: { $in: booking.reservationIds } })
        .toArray();

      await reservationcollection.updateMany(
        { _id: { $in: booking.reservationIds } },
        { $set: { isCancelled: true } }
      );

      // updating the room collection to remove the booked dates
      const roomIds = reservations.map((reservation) => reservation.roomId);
      await roomCollection.updateMany(
        { _id: { $in: roomIds } },
        { $pull: { bookedDates: { $in: booking.dates } } }
      );

      const result = await bookingcollection.updateOne(
        { _id: bookingId },
        { $set: { isCancelled: true } }
      );

      return result.modifiedCount === 1;
    } else {
      console.log("Error: Booking not found: " + bookingId);
      return false;
    }
  } catch (e) {
    console.log("Error: Problem cancelling booking: " + bookingId);
    console.log(e);
  } finally {
    logYellow(
      "[Closing DB connection] - " + new Date().toLocaleTimeString() + "\n"
    );
    await client.close();
  }
};

/**
 * Remove a Booking by the passed in ID.
 *
 * @param bookingId ID of the Booking to remove
 * @returns Booking object
 */
export const removeTempBookingAndHoldDates = async (
  bookingId: string,
  needToDisconnect: boolean
) => {
  //SERVER LOGGING
  logMessage(
    "Method: removeTempBookingAndHoldDates",
    "Removing Booking by ID: " + bookingId
  );

  try {
    const tempBookingCollection = await InProcessBookingCollection();

    const tempBooking = await tempBookingCollection.findOne({
      _id: new ObjectId(bookingId),
    });

    const roomsWithTemporaryHoldDates = tempBooking.itinerary.map(
      (res: any) => new ObjectId(res._id)
    );
    const blockedOffDates = tempBooking.blockedOffDates;

    if (tempBooking) {
      const roomsCollection = await RoomsCollection();
      const result = await roomsCollection.updateMany(
        { _id: { $in: roomsWithTemporaryHoldDates } },
        { $pull: { temporaryHoldDates: { $in: blockedOffDates } } }
      );

      if (result) {
        console.log("Successfully removed blocked off dates from rooms");
      }
    }

    const result = await tempBookingCollection.findOneAndDelete({
      _id: new ObjectId(bookingId),
    });

    return result.value;
  } catch (error) {
    console.log("there was an error removing the temp booking and hold dates");
    console.log(error);
  } finally {
    if (needToDisconnect) {
      disconnectDB();
    }
  }
};

export const createCustomerBooking = async (tempBookingId: string) => {
  try {
    //SERVER LOGGING
    logMessage(
      "Method: createCustomerBooking",
      "Creating Customer From InProcessBooking by ID: " + tempBookingId
    );

    const roomsCollection = await RoomsCollection();
    const bookingCollection = await BookingsCollection();
    const customerCollection = await CustomersCollection();
    const reservationCollection = await ReservationsCollection();
    const tempBookingCollection = await InProcessBookingCollection();

    const tempBooking = await tempBookingCollection.findOne({
      _id: new ObjectId(tempBookingId),
    });

    if (!tempBooking) {
      console.log("Error: Temp Booking not found");
      return;
    }

    //add dates to booked dates collection in rooms
    const datesToBlockInRooms = tempBooking.blockedOffDates;
    const roomsUpdate = await roomsCollection.updateMany(
      {
        _id: {
          $in: tempBooking.itinerary.map((res: any) => new ObjectId(res._id)),
        },
      },
      { $push: { bookedDates: { $each: datesToBlockInRooms } } }
    );

    if (roomsUpdate) {
      console.log("Successfully added blocked off dates to rooms");
    }

    let customer: any;
    let customerFound = false;
    const previousCustomer = await customerCollection.findOne({
      email: tempBooking.customerInformation.email,
    });

    if (previousCustomer) {
      customer = previousCustomer;
      customerFound = true;
    } else {
      //create a new customer
      customer = await customerCollection.insertOne({
        firstName: tempBooking.customerInformation.firstName,
        lastName: tempBooking.customerInformation.lastName,
        email: tempBooking.customerInformation.email,
        phone: tempBooking.customerInformation.phone,
        address: tempBooking.customerInformation.address,
        city: tempBooking.customerInformation.city,
        state: tempBooking.customerInformation.state,
        zip: tempBooking.customerInformation.zip,
      });
    }

    if (customer) {
      console.log("Successfully found or created customer");
    }

    //create a new reservation
    const reservations = tempBooking.itinerary.map(
      (res: any, index: number) => {
        return {
          roomId: new ObjectId(res._id),
          petsIncluded: tempBooking.customerInformation.petsIncluded,
          allergiesIncluded: tempBooking.customerInformation.allergiesIncluded,
          petsDescription: tempBooking.customerInformation.petsDescription,
          foodAllergies: tempBooking.customerInformation.allergiesDescription,
          isCancelled: false,
          subtotal: tempBooking.itinerary[index].priceBreakdown.subtotal,
          total: tempBooking.itinerary[index].priceBreakdown.total,
          customer: new ObjectId(
            customerFound ? customer._id : customer.insertedId
          ),
        };
      }
    );
    const reservationRes = await reservationCollection.insertMany(reservations);

    if (reservationRes.length > 0) {
      console.log("Successfully created reservations");
    }

    const confirmationCode =
      "YI-" + tempBookingId!.substring(0, 8).toUpperCase();
    const bookingObj = {
      reservationIds: Object.values(reservationRes.insertedIds),
      transactionId: confirmationCode,
      dates: tempBooking.blockedOffDates,
      isCancelled: false,
      totalPrice: tempBooking.totalCost,
      bookingDeposit: tempBooking.amount,
      customerId: new ObjectId(
        customerFound ? customer._id : customer.insertedId
      ),
    };
    const insertedBooking = await bookingCollection.insertOne(bookingObj);

    if (insertedBooking) {
      console.log("Successfully created booking");
    }

    const result = await removeTempBookingAndHoldDates(tempBookingId, false);

    if (result) {
      console.log("Successfully removed temp booking and hold dates");
    }

    return confirmationCode;
  } finally {
    disconnectDB();
  }
};

export const createVendorBooking = async (vendorBooking: VendorBooking) => {
  try {
    //SERVER LOGGING
    logMessage("Method: createVendorBooking", "Creating Vendor Booking");

    const roomsCollection = await RoomsCollection();
    const bookingCollection = await BookingsCollection();
    const customerCollection = await CustomersCollection();
    const reservationCollection = await ReservationsCollection();

    const {
      vendorKey,
      datesOfStay,
      amount,
      totalCost,
      customerInformation,
      itinerary,
    } = vendorBooking;

    //add dates to booked dates collection in rooms

    const roomsWithBadDates = await roomsCollection
      .find(
        {
          name: {
            $in: itinerary.map((res: any) => res.roomName),
          },
        },
        {
          projection: {
            _id: 1,
            bookedDates: 1,
            unavailableDates: 1,
            temporaryHoldDates: 1,
          },
        }
      )
      .toArray();

    let unavailableDateFound = false;

    for (const room of roomsWithBadDates) {
      console.log(room);
      for (const date of datesOfStay) {
        console.log(date);
        if (
          room?.temporaryHoldDates?.includes(date) ||
          room?.unavailableDates?.includes(date) ||
          room?.bookedDates?.includes(date)
        ) {
          unavailableDateFound = true;
        }
      }
    }

    if (unavailableDateFound) {
      return {
        error: true,
        message:
          "Booking could not be created because one or more dates was unavailable. Please try again.",
      };
    }

    const badDateObjIds = roomsWithBadDates.map(
      (room: any) => new ObjectId(room._id)
    );

    const roomsUpdate = await roomsCollection.updateMany(
      {
        _id: {
          $in: badDateObjIds,
        },
      },
      { $push: { bookedDates: { $each: datesOfStay } } }
    );

    if (roomsUpdate) {
      console.log("Successfully added blocked off dates to rooms");
    }

    let customer: any;
    let customerFound = false;
    const previousCustomer = await customerCollection.findOne({
      email: customerInformation.email,
    });

    if (previousCustomer) {
      customer = previousCustomer;
      customerFound = true;
    } else {
      //create a new customer
      customer = await customerCollection.insertOne({
        firstName: customerInformation.firstName,
        lastName: customerInformation.lastName,
        email: customerInformation.email,
        phone: customerInformation.phone,
        address: customerInformation.address,
        city: customerInformation.city,
        state: customerInformation.state,
        zip: customerInformation.zip,
      });
    }

    if (customer) {
      console.log("Successfully found or created customer");
    }

    //create a new reservation
    const reservations = itinerary.map((res: any, index: number) => {
      return {
        roomId: badDateObjIds[index],
        petsIncluded: customerInformation.petsIncluded,
        allergiesIncluded: customerInformation.allergiesIncluded,
        petsDescription: customerInformation.petsDescription,
        foodAllergies: customerInformation.allergiesDescription,
        isCancelled: false,
        subtotal: itinerary[index].priceBreakdown.subtotal,
        total: itinerary[index].priceBreakdown.total,
        customer: new ObjectId(
          customerFound ? customer._id : customer.insertedId
        ),
      };
    });
    const reservationRes = await reservationCollection.insertMany(reservations);

    if (reservationRes.length > 0) {
      console.log("Successfully created reservations");
    }

    const confirmationCode =
      "V-" + uuidv4().replace(/-/g, "").substring(0, 10).toUpperCase();
    const bookingObj = {
      vendorKey,
      confirmationCode,
      reservationIds: Object.values(reservationRes.insertedIds),
      transactionId: confirmationCode,
      dates: datesOfStay,
      isCancelled: false,
      totalPrice: totalCost,
      bookingDeposit: amount,
      customerId: new ObjectId(
        customerFound ? customer._id : customer.insertedId
      ),
    };
    const insertedBooking = await bookingCollection.insertOne(bookingObj);

    if (insertedBooking) {
      console.log("Successfully created booking");
    }

    return { confirmationCode };
  } finally {
    disconnectDB();
  }
};

export const getAllBookingsWithCustomerAndReservation = async () => {
  try {
    const bookingCollection = await BookingsCollection();

    const pipeline = [
      {
        $lookup: {
          from: "Customer",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "RoomReservation",
          let: { reservationIds: "$reservationIds" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$reservationIds"],
                },
              },
            },
          ],
          as: "reservations",
        },
      },
      {
        $project: {
          _id: 1,
          transactionId: 1,
          dates: 1,
          vendorKey: 1,
          totalPrice: 1,
          customerId: 1,
          isCancelled: 1,
          customer: { $arrayElemAt: ["$customer", 0] },
          reservations: 1,
        },
      },
    ];

    const bookingsWithCustomerAndReservation = await bookingCollection
      .aggregate(pipeline)
      .toArray();
    return bookingsWithCustomerAndReservation;
  } catch (error) {
    console.error(
      "Error fetching bookings with customer and reservation:",
      error
    );
    return null;
  } finally {
    disconnectDB();
  }
};

// /**
//  * Method to create a booking from a third party
//  * @param incomingBooking Booking Object from Third Party
//  * @returns returns the confirmation code
//  */
// export const createBookingViaThirdParty = async (incomingBoking: any) => {
//   //SERVER LOGGING
//   logMessage(
//     "Method: createBookingViaThirdParty",
//     "Creating Booking From Third Party",
//   );

//   const roomsCollection = await RoomsCollection();
//   const bookingCollection = await BookingsCollection();
//   const customerCollection = await CustomersCollection();
//   const reservationCollection = await ReservationsCollection();
//   const tempBookingCollection = await InProcessBookingCollection();

//   const tempBooking = await tempBookingCollection.findOne({
//     _id: new ObjectId(tempBookingId),
//   });

//   //add dates to booked dates collection in rooms
//   const datesToBlockInRooms = tempBooking.blockedOffDates;
//   const roomsUpdate = await roomsCollection.updateMany(
//     {
//       _id: {
//         $in: tempBooking.itinerary.map((res: any) => new ObjectId(res._id)),
//       },
//     },
//     { $push: { bookedDates: { $each: datesToBlockInRooms } } },
//   );

//   if (roomsUpdate) {
//     console.log("Successfully added blocked off dates to rooms");
//   }

//   let customer: any;
//   let customerFound = false;
//   const previousCustomer = await customerCollection.findOne({
//     email: tempBooking.customerInformation.email,
//   });

//   if (previousCustomer) {
//     customer = previousCustomer;
//     customerFound = true;
//   } else {
//     //create a new customer
//     customer = await customerCollection.insertOne({
//       firstName: tempBooking.customerInformation.firstName,
//       lastName: tempBooking.customerInformation.lastName,
//       email: tempBooking.customerInformation.email,
//       phone: tempBooking.customerInformation.phone,
//       address: tempBooking.customerInformation.address,
//       city: tempBooking.customerInformation.city,
//       state: tempBooking.customerInformation.state,
//       zip: tempBooking.customerInformation.zip,
//     });
//   }

//   if (customer) {
//     console.log("Successfully found or created customer");
//   }

//   //create a new reservation
//   const reservations = tempBooking.itinerary.map((res: any, index: number) => {
//     return {
//       roomId: new ObjectId(res._id),
//       petsIncluded: tempBooking.customerInformation.petsIncluded,
//       allergiesIncluded: tempBooking.customerInformation.allergiesIncluded,
//       petsDescription: tempBooking.customerInformation.petsDescription,
//       foodAllergies: tempBooking.customerInformation.allergiesDescription,
//       isCancelled: false,
//       subtotal: tempBooking.itinerary[index].priceBreakdown.subtotal,
//       total: tempBooking.itinerary[index].priceBreakdown.total,
//       customer: new ObjectId(
//         customerFound ? customer._id : customer.insertedId,
//       ),
//     };
//   });
//   const reservationRes = await reservationCollection.insertMany(reservations);

//   if (reservationRes.length > 0) {
//     console.log("Successfully created reservations");
//   }

//   const confirmationCode = "YI-" + tempBookingId!.substring(0, 8).toUpperCase();
//   const bookingObj = {
//     reservationIds: reservationRes.insertedIds,
//     transactionId: confirmationCode,
//     totalPrice: tempBooking.totalCost,
//     bookingDeposit: tempBooking.amount,
//     customerId: new ObjectId(
//       customerFound ? customer._id : customer.insertedId,
//     ),
//   };
//   const insertedBooking = await bookingCollection.insertOne(bookingObj);

//   if (insertedBooking) {
//     console.log("Successfully created booking");
//   }

//   const result = await removeTempBookingAndHoldDates(tempBookingId, false);

//   if (result) {
//     console.log("Successfully removed temp booking and hold dates");
//   }

//   return confirmationCode;
// };
