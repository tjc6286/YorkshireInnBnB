export type Booking = {
    _id:string;
    reservationIDs:Array<string>;
    transactionID: string;
    totalPrice: number;
    isThirdParty: boolean;
    customerID:string;
}