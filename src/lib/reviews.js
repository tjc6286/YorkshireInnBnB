import { Reviews } from "./mongodb";

export const getAllReviews = async () => {
  const reviews = await (await Reviews()).find({}).toArray();
  return reviews;
};
