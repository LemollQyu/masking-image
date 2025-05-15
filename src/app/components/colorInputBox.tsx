"use client";

import { useState } from "react";

type Props = {
  onColorChange: (color: string) => void;
};

export default function ColorInputBox({ onColorChange }: Props) {
  const [targetColor, setTargetColor] = useState("#bed2e6");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      setTargetColor(value); // Update state lokal
      onColorChange(value); // Kirim ke parent
    }
  };

  return (
    <div className="border flex items-center gap-2 pr-10 border-dashed justify-between border-gray-300 p-2 rounded-md hover:bg-gray-50 transition relative">
      <strong className="text-gray-500">Target Color:</strong>
      <input
        type="text"
        onChange={handleChange}
        placeholder="#rrggbb"
        className="border runde-400 px-2 py-2 rounded text-sm"
      />
      <div
        className="absolute right-5 border w-[37px] h-[37px] rounded"
        style={{ backgroundColor: targetColor }}
      ></div>
    </div>
  );
}
