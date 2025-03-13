'use client';

import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export default function DateReserve() {
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                sx={{ width: "100%" }}
            />
        </LocalizationProvider>
    );
}