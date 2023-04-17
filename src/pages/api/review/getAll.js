import { getAllReviews } from "../../../lib/reviews";

/**
 * Endpoint to get all reviews
 * @returns {Response} Returns all reviews wrapped in a Response object
 */
export const get = async () => {
  console.log("Log - GET ALL REVIEWS");
  const reviews = await getAllReviews();
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
