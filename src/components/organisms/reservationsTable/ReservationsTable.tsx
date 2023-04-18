import type React from "react";
import type { ReservationWithPriceBreakdown } from "../../../types/reservation";

interface IReservationTableProps {
  reservations: Array<ReservationWithPriceBreakdown>;
  onRemove: (id: string) => void;
  unaccountedGuests?: number;
}

const ReservationsTable: React.FC<IReservationTableProps> = ({
  reservations,
  onRemove,
  unaccountedGuests,
}) => {
  return (
    <div className="">
      <table className="w-full rounded-md border-2 text-left text-sm ">
        <thead className="bg-[#36353A] text-neutral-100 text-xs uppercase ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Room Name
            </th>
            <th scope="col" className="px-6 py-3">
              Number of Guests
            </th>
            <th scope="col" className="px-6 py-3">
              Subtotal
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(
            (reservation: ReservationWithPriceBreakdown, index: number) => (
              <tr key={`index-${index}`} className="border-b">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium"
                >
                  {reservation.roomName}
                </th>
                <td className="px-6 py-4">{reservation.guestCount} Guests</td>
                <td className="px-6 py-4">
                  ${reservation.priceBreakdown.subtotal}
                </td>
                <td className="px-6 py-4 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 mb-2 rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none"
                    onClick={() => onRemove(reservation._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      {unaccountedGuests !== 0 && (
        <p className="text-sm text-red-400">
          <span className="font-bold underline">Warning:</span> 2 guests
          unaccounted for. Please select another available room!
        </p>
      )}
    </div>
  );
};

export default ReservationsTable;
