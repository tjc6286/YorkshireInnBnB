import { ReviewsCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllReviews = async () => {
  const reviews = await (await ReviewsCollection()).find({}).toArray();
  return reviews;
};

/**
 *
 * @param {id, rating, authorName, reviewText, date, isPublic, isApproved} review
 */
export const addReview = async (incomingReview) => {
  const reviews = await ReviewsCollection();

  //TODO: validate the information
  console.log(incomingReview);
  await reviews.insertOne({ ...incomingReview }, function (err, res) {
    if (err) throw err;
    console.log("Error: Problem inserting review: " + incomingReview);
  });
};
