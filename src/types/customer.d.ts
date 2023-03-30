export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone:string;
  address1:string;
  city:string
  state:string;
  zip:string;
  previousBookings: Array<string>;
};

