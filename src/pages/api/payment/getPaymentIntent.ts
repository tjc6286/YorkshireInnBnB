import type { APIRoute } from "astro";
import Stripe from "stripe";
import { updateInProcessBooking } from "../../../lib/bookings";
import { addHoldDates } from "../../../lib/rooms";
const secretKey = import.meta.env.STRIPE_TEST_SECRET_KEY_PRIVATE;
/**
 * API Enpoint to create a Stripe Checkout Session. This is the first step in the
 * payment process. This endpoint also takes care of updating the InProcessBooking with
 * the customer information and the blocked off dates. And add the hold dates to the
 * rooms in the itinerary.
 *
 * @returns { Response } returns a Response object with the Stripe Checkout Session URL
 */
export const post: APIRoute = async ({ request, redirect }) => {
  request.headers.set("Access-Control-Allow-Origin", "*");
  request.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  request.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  // initialize Stripe
  const stripe = new Stripe(secretKey, {
    apiVersion: "2022-11-15",
  });

  if (request.headers.get("Content-Type") === "application/json") {
    var data = await request.json();
    //Extract the data from the request body
    const { amountDue, bookingInfo, totalCost, id, customerInformation } = data;

    //Get the blocked off dates from the bookingInfo
    const blockedOffDates =
      bookingInfo.itinerary[0].priceBreakdown.dailyPrices.map((item: any) => {
        return item.date;
      });

    //Getting the room ids from the bookingInfo to update
    const roomsToUpdate = bookingInfo.itinerary.map((room: any) => room._id);
    //Add the hold dates to the rooms
    const tempDateBlockoff = await addHoldDates(roomsToUpdate, blockedOffDates);

    if (!tempDateBlockoff) {
      return new Response(null, { status: 400 });
    }

    const updatedTempBookingSuccess = await updateInProcessBooking(
      id,
      amountDue,
      totalCost,
      customerInformation,
      blockedOffDates
    );

    if (!updatedTempBookingSuccess) {
      return new Response(null, { status: 400 });
    }

    try {
      //Create the Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Your stay at the Yorkshire Inn",
                images: [
                  "https://img1.wsimg.com/isteam/ip/9b26c130-cfe7-497c-921f-19fe8960b059/logo_wBevel_0322_bgGrey%20(1).jpg/:/rs=w:560,h:400,cg:true,m/cr=w:560,h:400/qt=q:95",
                ],
              },
              unit_amount: amountDue,
            },

            quantity: 1,
          },
        ],
        mode: "payment",
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        success_url: `${
          process.env.SITE_DOMAIN || import.meta.env.SITE_DOMAIN
        }/confirmation/${id}`,
        cancel_url: `${
          process.env.SITE_DOMAIN || import.meta.env.SITE_DOMAIN
        }/bookingError/${id}`,
      });

      //return the session url
      return new Response(JSON.stringify(session.url), { status: 303 });
    } catch (error) {
      console.log(`Error creating payment intent: ${error}`);
    }
  }
  return new Response(null, { status: 200 });
};
