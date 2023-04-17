import { ReviewsCollection } from "./mongodb";

/**
 * Method to get all reviews
 * @returns All reviews
 */
export const getAllReviews = async () => {
  const reviews = await (await ReviewsCollection()).find({}).toArray();
  return reviews;
};

/**
 * Method to insert a review to the database Review collection
 * @param {*} incomingReview The review to be inserted
 * @returns The inserted review
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
