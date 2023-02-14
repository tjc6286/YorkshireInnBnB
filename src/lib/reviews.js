import { ReviewsCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllReviews = async () => {
  const reviews = await (await ReviewsCollection()).find({}).toArray();
  return reviews;
};
