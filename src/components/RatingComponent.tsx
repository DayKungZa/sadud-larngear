"use client";

import { useState } from "react";
import Rating from "@mui/material/Rating";

interface RatingProps {
  venueName: string;
}

export default function RatingComponent({ venueName }: RatingProps) {
  const [value, setValue] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-left items-bottom z-30">
      <Rating
        id={`${venueName} Rating`}
        name={`${venueName} Rating`}
        data-testid={`${venueName} Rating`}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
      />
    </div>
  );
}
