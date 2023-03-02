import { addReview } from "../../../lib/reviews";
import type { APIRoute } from 'astro';
/**
 *
 * @returns
 */
export const post: APIRoute = async ({ request }) => {
  var newReview = await request.json();
  if (request.headers.get("Content-Type") === "application/json") {
    const review = await addReview(newReview);
    return new Response(JSON.stringify(review), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });
}