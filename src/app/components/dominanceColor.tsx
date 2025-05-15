"use client";
import { useState } from "react";

type Props = {
  onToleranceChange: (value: number) => void;
};

export default function ToleranceColor({ onToleranceChange }: Props) {
  const [inputValue, setInputValue] = useState("40");
  const [tolerance, setTolerance] = useState(40);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value) && value >= 10 && value <= 150) {
      setTolerance(value);
      onToleranceChange(value); // <-- Kirim ke parent
    } else {
      setInputValue(tolerance.toString());
    }
  };

  return (
    <>
      <div className="border justify-between flex items-center gap-2 border-dashed border-gray-300 p-2 rounded-md hover:bg-gray-50 transition relative">
        <strong className="text-gray-500">Tolerance Color:</strong>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={10}
          max={150}
          placeholder="40"
          className="border border-gray-400 px-2 py-2 rounded text-sm"
        />
      </div>

      <div>
        <strong className="text-gray-500">📝 Catatan: </strong>
        <p className="text-sm text-gray-500">
          Toleransi warna menentukan seberapa besar gradasi warna di sekitar
          warna target yang akan ikut dipengaruhi. Semakin besar nilai
          toleransi, maka semakin luas rentang warna yang akan dianggap mirip
          dan diubah bersama warna target.
        </p>
      </div>
    </>
  );
}
