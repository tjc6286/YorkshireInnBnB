import type { APIRoute } from "astro";
import Stripe from "stripe";
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  const stripe = new Stripe("your_stripe_secret_key", {
    apiVersion: "2022-11-15",
  });

  var data = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const amount = data.amount;
    const currency = "usd";
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      return new Response(
        JSON.stringify({ client_secret: paymentIntent.client_secret }),
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(`Error creating payment intent: ${error}`);
      throw error;
    }
  }
  return new Response(null, { status: 400 });
};
