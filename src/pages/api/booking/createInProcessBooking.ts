import type { APIRoute } from "astro";
import { eachDayOfInterval, format } from "date-fns";
import { insertNewInProcessBooking } from "../../../lib/bookings";
import { addHoldDates } from "../../../lib/rooms";

/**
 * This API route is used to create a new InProcessBooking in the database
 * to help pass along the data in the checkout flow.
 *
 * @param { request } holds the data coming in from the client
 * - startDate: Date
 * - endDate: Date
 * - itinerary : Array of Room Objects
 * @returns send back the new InProcessBooking ObjectID
 **/
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();

    const allDatesBetweenStartAndEndDate = eachDayOfInterval({
      start: new Date(data.startDate),
      end: new Date(data.endDate),
    });

    const dateStrings = allDatesBetweenStartAndEndDate.map((date) =>
      format(date, "MM-dd-yyyy")
    );

    const roomsToUpdate = data.itinerary.map((room: any) => room._id);
    const datesAdded = await addHoldDates(roomsToUpdate, dateStrings);

    if (!datesAdded) {
      return new Response(null, { status: 400 });
    }

    //TODO: Validate all customer | reservation | booking data coming in

    const res = await insertNewInProcessBooking(data);

    if (!res) {
      return new Response(null, { status: 400 });
    }

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
