"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type Props = {
  onFileChange: (file: File) => void;
};

export default function ImageUploader({ onFileChange }: Props) {
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fileImage) {
      onFileChange(fileImage);
    }
  }, [fileImage, onFileChange]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="w-full mx-auto ">
      <div
        {...getRootProps()}
        className="border border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Image
            height={40}
            width={40}
            alt="icon"
            src="/icon/image.png"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
          <p className="runde-400 text-sm text-gray-500">
            {isDragActive
              ? "Lepaskan gambar di sini..."
              : "Tarik gambar ke sini atau klik untuk unggah"}
          </p>
        </div>
      </div>

      {fileImage ? (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <strong>File:</strong> {fileImage.name}
          </p>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-full max-h-64 object-contain border border-dashed border-gray-300 rounded-md"
            />
          )}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 h-[180px] w-full mt-2"></div>
      )}
    </div>
  );
}
