import { getAllReviews } from "../../lib/reviews";

export const get = async () => {
  console.log("endpoint");
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
