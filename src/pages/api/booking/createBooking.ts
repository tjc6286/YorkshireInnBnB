import { insertNewbooking } from "../../../lib/bookings";
// import { insertNewCustomer } from "../../../lib/customers";
// import { insertNewReservation } from "../../../lib/reservations";
import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import { insertNewCustomer } from "../../../lib/customers";
import { insertNewReservation } from "../../../lib/reservations";
/**
 *
 * @param { request }
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();

    // //TODO: Validate all customer | reservation | booking data coming in
    // const res = bookingCreateTransaction(
    //   data.booking,
    //   data.customer,
    //   data.reservation
    // );

    const customer = await insertNewCustomer(data.customer);

    if (!customer) {
      return new Response(null, { status: 400 });
    }

    //TODO: HANDLE MORE THAN ONE RESERVATION
    const reservation = await insertNewReservation(data.reservation);

    if (!reservation) {
      return new Response(null, { status: 400 });
    }

    const bookingObj = {
      reservationIds: [reservation],
      transactionId: "100232",
      totalPrice: 238.65,
      isThirdParty: false,
      customerId: new ObjectId(customer),
    };

    const booking = await insertNewbooking(bookingObj);

    return new Response(JSON.stringify({ booking }), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
};
