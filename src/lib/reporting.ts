import { logMessage } from "./logger";
import {
  BookingsCollection,
  ReservationsCollection,
  RoomsCollection,
  disconnectDB,
} from "./mongodb";

export const countReservationsPerRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: countReservationsPerRoom", "Counting Reservations");

  try {
    const reservationCollection = await await ReservationsCollection();

    const pipeline = [
      {
        $group: {
          _id: "$roomId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "Room",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          roomName: "$room.name",
          count: 1,
        },
      },
    ];

    const reservationsPerRoom = await reservationCollection
      .aggregate(pipeline)
      .toArray();

    return reservationsPerRoom;
  } catch (error) {
    console.error("Error counting reservations per room:", error);
    return null;
  } finally {
    disconnectDB();
  }
};

export const sumTotalPerRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: sumTotalPerRoom", "Summing Totals");

  try {
    const reservationCollection = await ReservationsCollection();
    const roomCollection = await RoomsCollection();

    const pipeline = [
      {
        $lookup: {
          from: reservationCollection.collectionName,
          let: { roomId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$roomId", "$$roomId"] },
              },
            },
            {
              $group: {
                _id: "$roomId",
                totalSum: { $sum: "$total" }, // Change this line
              },
            },
          ],
          as: "reservations",
        },
      },
      {
        $unwind: {
          path: "$reservations",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          roomName: "$name",
          totalSum: { $ifNull: ["$reservations.totalSum", 0] }, // Change this line
        },
      },
    ];

    const totalPerRoom = await roomCollection.aggregate(pipeline).toArray(); // Rename the variable
    return totalPerRoom;
  } catch (error) {
    console.error("Error calculating sum of totals per room:", error);
    return null;
  } finally {
    disconnectDB();
  }
};

export const countBookingSource = async () => {
  try {
    const bookingCollection = await BookingsCollection();

    const pipeline = [
      {
        $facet: {
          thirdParty: [
            { $match: { vendorKey: { $exists: true } } },
            { $count: "count" },
          ],
          nonThirdParty: [
            { $match: { vendorKey: { $exists: false } } },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          thirdParty: {
            $ifNull: [{ $arrayElemAt: ["$thirdParty.count", 0] }, 0],
          },
          nonThirdParty: {
            $ifNull: [{ $arrayElemAt: ["$nonThirdParty.count", 0] }, 0],
          },
        },
      },
    ];

    const bookingsByType = await bookingCollection
      .aggregate(pipeline)
      .toArray();
    return bookingsByType[0];
  } catch (error) {
    console.error("Error counting bookings by type:", error);
  } finally {
    disconnectDB();
  }
};
