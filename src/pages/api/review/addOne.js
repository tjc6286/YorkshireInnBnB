import { addReview } from "../../../lib/reviews";

/**
 *
 * @returns
 */
export const post = async ({ params, request }) => {
  const incomingReview = await request.json();
  console.log("Log - INSERTING REVIEW: " + incomingReview);
  const reviews = await addReview(incomingReview);
  if (!reviews) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(reviews), {
    status: 200,
  });
};
