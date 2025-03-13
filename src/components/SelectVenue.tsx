import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import React from "react";

export default function SelectVenue() {
    const [venue, setVenue] = React.useState("");

    return (
        <FormControl fullWidth variant="standard">
            <InputLabel id="venue-label">Select Venue</InputLabel>
            <Select
                labelId="venue-label"
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
            >
                <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                <MenuItem value="Spark">Spark Space</MenuItem>
                <MenuItem value="GrandTable">The Grand Table</MenuItem>
            </Select>
        </FormControl>
    );
}