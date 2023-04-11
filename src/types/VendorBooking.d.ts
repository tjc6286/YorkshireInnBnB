/**
 * The VendorBooking interface is used to describe the data structure of the
 * data returned from the vendor API. This interface is used to type
 * the data returned from the vendor API, and it is used to type the
 * vendorBooking object in the vendorBookingReducer.
 */

type VendorBooking = {
  vendorKey: string;
  itinerary: [
    {
      roomName: string;
      guestCount: number;
      priceBreakdown: {
        subtotal: number;
        tax: number;
        bookingFee: number;
        total: number;
      };
    },
  ];
  datesOfStay: Array<string>;
  customerInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    petsDescription: string;
    allergiesDescription: string;
    petsIncluded: boolean;
    allergiesIncluded: boolean;
  };
  totalCost: number;
};

export default VendorBooking;

/**
 * The mockVendorBooking is used to type the mockVendorBooking data
 * that is passed to the vendorBookingReducer. The mockVendorBooking
 * is used to type the vendorBooking object in the vendorBookingReducer.
 */

const mockVendorBooking: VendorBooking = {
  vendorKey: "9d69f9bb-0cba-4be7-93b1-be2625a5d03e",
  itinerary: [
    {
      roomName: "Bolero",
      guestCount: 2,
      priceBreakdown: {
        subtotal: 300,
        tax: 25,
        bookingFee: 10,
        total: 335,
      },
    },
  ],
  datesOfStay: ["2023-07-19", "2023-07-20", "2023-07-21"],
  customerInformation: {
    firstName: "John",
    lastName: "Doe",
    email: "test434@test.com",
    phone: "555-555-5555",
    address: "123 Main St",
    city: "San Diego",
    state: "CA",
    zip: "92101",
    petsDescription: "No pets",
    allergiesDescription: "No allergies",
    petsIncluded: false,
    allergiesIncluded: false,
  },
  totalCost: 335,
};
