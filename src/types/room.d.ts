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
  bookedDates: Array<string>;
  imgPathName: string;
};

export type RoomUnavailableDates = Pick<
  Room,
  "_id" | "name" | "unavailableDates" | "temporaryHoldDates"
>;
//create a new type that extends Room and includes an isAvailable property
export type RoomAvailability = Room & {
  isAvailable: boolean;
};
