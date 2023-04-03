import { getAllBookings } from "../../../lib/bookings";
import { getCustomerByID } from "../../../lib/customers";
/**
 *
 * @returns
 */
export const get = async () => {
  const bookings = await getAllBookings();

  const newBookingList = [];
  //iterate over bookings and add customer data to customerList use the getCustomerById function
  for (const booking of bookings) {
    const customer = await getCustomerByID(booking.customerId);
    newBookingList.push({ booking: booking, customer: customer });
  }

  if (!bookings) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(newBookingList), {
    status: 200,
  });
};
