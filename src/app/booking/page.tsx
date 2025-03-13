"use client";

import * as React from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DateReserve from "@/components/DateReserve";
import TextInsert from "@/components/TextInsert";
import SelectVenue from "@/components/SelectVenue";

export default function BookingPage() {
    const [venue, setVenue] = React.useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form Submitted!");
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center text-purple-900">
                  Venue Booking
                </h2>

                <TextInsert field="Name-Surname"/>

                <TextInsert field="Contact-Number"/>

                <SelectVenue />

                <DateReserve />

                <Button type="submit" name="Book Venue" variant="contained" color="primary" fullWidth>
                    Book Venue
                </Button>
            </form>
        </div>
    );
}
