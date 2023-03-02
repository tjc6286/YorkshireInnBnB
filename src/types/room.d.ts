import type SpecialDatePrice from "./specialDatePrice";

export type Room = {
  _id: string;
  name: "Bolero" | "The Rose Suite" | "Lodge Suite" | "Blue Room";
  description: string;
  priceRange: string;
  specialPriceDates: Array<SpecialDatePrice>;
  maximumOccupancy: number;
  basePrice: number;
  unavailableDates: Array<string>;
  temporaryHoldDates: Array<string>;
};

export type RoomUnavailableDates = Pick<
  Room,
  "_id" | "name" | "unavailableDates" | "temporaryHoldDates"
>;
