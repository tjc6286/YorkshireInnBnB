import type SpecialDatePrice from "./specialDatePrice";

export type Reservation = {
  _id: string;
  roomID: string;
  guestCount: number;
  isCanceled: boolean;
  cancelReason: string;
  petsIncluded: string;
  petsDescription: string;
  foodAllergies: string;
  subtotal: number;
};

// create a type that extends Reservation and includes a roomName property
export type ReservationWithRoomName = Reservation & {
  roomName: "Bolero" | "The Rose Suite" | "Lodge Suite" | "Blue Room";
};

//create a type that is a subset of Reservation and includes a roomName property
export type TempReservation = Pick<
  ReservationWithRoomName,
  "_id" | "roomName" | "guestCount"
>;

//create a type that extends tempReservation and includes a priceBreakdown property
export type ReservationWithPriceBreakdown = TempReservation & {
  priceBreakdown: {
    dailyPrices: Array<SpecialDatePrice>;
    subtotal: number;
    tax: number;
    bookingFee: number;
    total: number;
  };
};
