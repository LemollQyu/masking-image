"use client";
import { useState } from "react";
import Image from "next/image";

type Mode = "color" | "texture" | null;

interface ModeSelectorProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onHexFileChange?: (file: File) => void;
  onTextureFileChange?: (file: File) => void;
}

export default function ModeSelector({
  mode,
  setMode,
  onHexFileChange,
  onTextureFileChange,
}: ModeSelectorProps) {
  const [hexFile, setHexFile] = useState<File | null>(null);
  const [textureFile, setTextureFile] = useState<File | null>(null);

  const handleHexFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHexFile(file);
      onHexFileChange?.(file); // kirim ke parent jika ada
    }
  };

  const handleTextureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTextureFile(file);
      onTextureFileChange?.(file); // kirim ke parent jika ada
    }
  };

  return (
    <div className="mt-4 border border-dashed border-gray-300 p-4 rounded-md hover:bg-gray-50 transition relative space-y-4">
      <div className="flex items-center justify-between gap-2">
        <strong className="text-gray-500">Mode Perubahan:</strong>

        {mode ? (
          <div className="flex items-center gap-4">
            <strong className="text-gray-700 capitalize">
              {mode === "color" ? "🎨 With Color" : "🧵 With Texture"}
            </strong>
            <button
              className="w-[37px] h-[37px] flex items-center justify-center cursor-pointer rounded-full border text-blue-500 hover:bg-[#bacce0] transition"
              onClick={() => {
                setMode(null);
                setHexFile(null);
                setTextureFile(null);
              }}
            >
              <Image src="/icon/reset.png" alt="Reset" width={29} height={29} />
            </button>
          </div>
        ) : (
          <div className="gap-2 flex">
            <button
              className="px-3 h-[37px] cursor-pointer py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-sm transition"
              onClick={() => setMode("color")}
            >
              🎨 With Color
            </button>
            <button
              className="px-3 py-1 h-[37px] cursor-pointer rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-sm transition"
              onClick={() => setMode("texture")}
            >
              🧵 With Texture
            </button>
          </div>
        )}
      </div>

      {/* Tampilan untuk With Color */}
      {mode === "color" && (
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600 font-medium">
            Upload File Warna (.txt / .csv)
          </label>
          <input
            type="file"
            accept=".txt,.csv"
            onChange={handleHexFileChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          {hexFile && (
            <p className="text-xs text-green-600">
              File dipilih: <strong>{hexFile.name}</strong>
            </p>
          )}
        </div>
      )}

      {/* Tampilan untuk With Texture */}
      {mode === "texture" && (
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600 font-medium">
            Upload Tekstur Gambar (.jpg / .png)
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleTextureFileChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          {textureFile && (
            <p className="text-xs text-green-600">
              File dipilih: <strong>{textureFile.name}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
