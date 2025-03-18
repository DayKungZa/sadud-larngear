import React from "react";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-800 font-medium">
        {label}: {value}
      </label>
      <input
        type="range"
        min="-100"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default Slider;
