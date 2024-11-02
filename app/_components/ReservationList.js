"use client";

import { useOptimistic } from "react";
import { deleteReservation } from "@/app/_lib/actions";
import ReservationCard from "@/app/_components/ReservationCard";

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    },
  );

  async function handleDeleteReservation(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={() => handleDeleteReservation(booking.id)}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
