# Team Infinity: Senior Development Project

**Project Name** : Yorkshire Inn’s booking system upgrade

**Project Objective:** 

Our objectives for this project are to create a new design for the website, starting with a complete restructure of the frontend of the system. We must also research and build up a new hosting platform for the website, one that better suits the needs of the owners. A complete redesign of the backend, making sure to satisfy the MVP requirements, that of which is not allowing double bookings to occur within the booking system. We must create an admin portal for the owners, allowing them to make changes to room pricing and view reporting of past reservation data, trends, etc. This would include a need for a new database for storage of customer and reservation information when bookings are made.

**Team Members** :

-  Hannah Gosselin (hrg5188@rit.edu)
- Taylor Dennison (tsd2771@rit.edu)
- Francisco Paliouras (fxp6816@rit.edu)
- Alex Sanchez (ass2022@rit.edu)
- Tom Chenevey (tjc6286@rit.edu)
- Cody Potts (cdp8378@rit.edu)

## 🚀 Project Structure

Inside of your project, you'll see the following folders and files holding both frontend and backend code:

```
/
├── public/
├── src/
│   └── components/
│       └── atoms
│           └── button
│           └── index.ts
│       └── organisms
│           └── BookingLookup
│           └── customerInformationForm
│           └── dateRangeSeletors
│           └── fireBaseAuth
│           └── reservationTables
│           └── index.ts
│       └── pages
│           └── adminBooking
│           └── adminHome
│           └── adminReporting
│           └── adminRoom
│           └── adminVendor
│           └── index.ts
│       └── pages
│   └── lib/
│       └── booking.ts
│       └── customer.ts
│       └── logger.ts
│       └── mongodb.js
│       └── reporting.ts
│       └── reservations.ts
│       └── rooms.ts
│       └── vendors.ts
│   └── pages/
│       └── api
│           └── auth
│           └── booking
│           └── customer
│           └── payment
│           └── reporting
│           └── review
│           └── room
│           └── vendor
|       └── adminBooking.astro
|       └── adminHome.astro
|       └── adminReporting.astro
|       └── adminRoom.astro
|       └── adminVendor.astro
|       └── customerInfo.astro
|       └── index.astro
|       └── login.astro
|       └── manageBooking.astro
|       └── startBooking.astro
│   └── firebase.ts
└── package.json
```

## Third-Party API

This API endpoint allows vendors to create a booking for their customers. The request must include a valid vendorKey and the booking details. At the moment there is no current process to request for an admin to generate a vendor key.

### Endpoint 

The endpoint for this API is:

```bash
POST www.yorkshireinnteaminfinity.com/api/vendor/createBooking
```

### Request Payload

The request payload must be in JSON format and should include the following parameters:

- `vendorKey` (string, required): the vendor key for authentication purposes.
- `itinerary` (array, required): an array of objects representing the itinerary for the booking. Each object should include the following parameters:
  - `roomName` (string, required): the name of the room being booked.
  - `guestCount` (integer, required): the number of guests staying in the room.
  - `priceBreakdown` (object, required): an object containing the following parameters:
    - `subtotal` (integer, required): the subtotal cost of the room.
    - `tax` (integer, required): the tax amount for the room.
    - `bookingFee` (integer, required): the booking fee for the room.
    - `total` (integer, required): the total cost of the room. (Example: totalCost = 350, so you must send 35000 in the request).
- `amount` (integer, required): the amount paid for the booking.
- `datesOfStay` (array, required): an array of dates representing the dates of stay for the booking. Each date should be in the format "MM/DD/YYYY".
- `customerInformation`  (object, required): an object containing the following parameters:
  - `firstName` (string, required): the first name of the customer.
  - `lastName` (string, required): the last name of the customer.
  - `email` (string, required): the email address of the customer.
  - `phone` (string, required): the phone number of the customer.
  - `address` (string, required): the address of the customer.
  - `city` (string, required): the city of the customer.
  - `state` (string, required): the state of the customer.
  - `zip` (string, required): the zip code of the customer.
  - `petsDescription` (string, optional): a description of the customer's pets.
  - `allergiesDescription` (string, optional): a description of the customer's allergies.
  - `petsIncluded` (boolean, optional): indicates if pets are included in the booking.
  - `allergiesIncluded` (boolean, optional): indicates if allergies are included in the booking.
- `totalCost` (integer, required): the total cost of the booking, note the API will want this number to be the total cost multiplied by 100 (Example: total = 350, so you must send 35000 in the request).

### Response

The response will be in JSON format and will include the following parameters:

- `Confirmation Code` (string): The confirmation code for the booking just created
- `errorMessage` (string, optional): an error message if the booking could not be created.

### Example Request

```javascript
// Request Object Structure
const bookingData = {
  "vendorKey": "9d69f9bb-0cba-4be7-93b1-be2623e",
  "itinerary": [
    {
      "roomName": "Bolero",
      "guestCount": 2,
      "priceBreakdown": {
        "subtotal": 30000,
        "tax": 2500,
        "bookingFee": 1000,
        "total": 33500
      }
    }
  ],
  "amount": 335,
  "datesOfStay": ["07/26/2023", "07/27/2023", "07/28/2023"],
  "customerInformation": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "test434@test.com",
    "phone": "555-555-5555",
    "address": "123 Main St",
    "city": "San Diego",
    "state": "CA",
    "zip": "92101",
    "petsDescription": "No pets",
    "allergiesDescription": "No allergies",
    "petsIncluded": false,
    "allergiesIncluded": false
  },
  "totalCost": 33500
};

//Example Query
fetch('www.yorkshireinnteaminfinity.com/api/vendor/createBooking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(bookingData)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
```



##  Project Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |
