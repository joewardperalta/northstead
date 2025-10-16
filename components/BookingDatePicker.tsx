"use client";

import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type BookingLite = { date: string; timeSlot?: string | null };

export default function BookingDatePicker() {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Load current month window
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);

    fetch(`/api/bookings?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((items: BookingLite[]) => {
        const disabled = items
          // Only date-level disabling; ignore timeSlot here
          .map((b) => {
            const d = new Date(b.date);
            d.setHours(0, 0, 0, 0);
            return d;
          });
        setBookedDates(disabled);
      })
      .catch(() => setBookedDates([]));
  }, []);

  // Remove duplicates
  const excludeDates = useMemo(() => {
    const key = new Set<number>();
    return bookedDates.filter((d) => {
      const t = d.getTime();
      if (key.has(t)) return false;
      key.add(t);
      return true;
    });
  }, [bookedDates]);

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(d) => setSelectedDate(d)}
      excludeDates={excludeDates}
      minDate={new Date()}
      placeholderText="Select a date"
      inline
    />
  );
}
