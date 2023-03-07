export type Reservation = {
    _id: string;
    roomID: string;
    guestCount: number;
    isCanceled: boolean;
    cancelReason:string;
    petsIncluded:string;
    petsDescription:string
    foodAllergies:string;
    subtotal:number;
  };