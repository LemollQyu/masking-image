"use client";
import Image from "next/image";
import ImageUploader from "./components/upLoaderImage";
import ColorInputBox from "./components/colorInputBox";
import DominanceColor from "./components/dominanceColor";
import ModeSelector from "./components/modePerubahan";
import { useState } from "react";
import ToleranceColor from "./components/dominanceColor";

type Mode = "color" | "texture" | null;

export default function Home() {
  const [mode, setMode] = useState<Mode>(null);

  const [isMake, setIsMake] = useState<String>("");

  const [imageFile, setImageFile] = useState<any>();
  const [hexFile, setHexFile] = useState<File | any>(null);
  const [targetColor, setTargetColor] = useState<any>("");
  const [tolerance, setTolerance] = useState<any>(0);
  const [textureFile, setTextureFile] = useState<File | any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTexture, setIsLoadingTexture] = useState(false);

  // data masking texture
  const [dataTexture, setDataTexture] = useState<{
    result_images: string[];
  } | null>(null);

  console.log("data texture = ", dataTexture);

  // data color masking
  const [dataColor, setDataColor] = useState<{
    result_images: string[];
  } | null>(null);

  const [selectedImageColor, setSelectedImageColor] = useState<string | null>(
    null
  );
  const [selectedImageTexture, setSelectedImageTexture] = useState<
    string | null
  >(null);

  // cek jika data file file yang dibutuhkan tidak ada
  const isButtonDisabled =
    isLoading ||
    !imageFile ||
    !hexFile ||
    !targetColor ||
    tolerance === 0 ||
    tolerance === "" ||
    tolerance === null;

  const handleClickColor = async () => {
    setDataTexture(null); // reset texture hasil
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("target_color", String(targetColor));
    formData.append("hex_list_file", hexFile);
    formData.append("tolerance", String(tolerance));

    try {
      setIsLoading(true); // Mulai loading
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/replace-color/`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setDataColor(data); // Isi hasil gambar
    } catch (error) {
      console.error("Failed to process:", error);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  const handleDownloadImage = async () => {
    if (!selectedImageColor) return;

    try {
      const response = await fetch(selectedImageColor);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedImageColor}-hasil-gambar.png`; // Nama file saat di-download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mendownload gambar:", error);
    }
  };

  // handle texture api
  const handleClickTexture = async () => {
    setDataColor(null); // Reset data color
    if (!textureFile) {
      console.error("Texture file is missing");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("target_color", String(targetColor));
    formData.append("texture", textureFile);
    formData.append("tolerance", String(tolerance));

    try {
      setIsLoadingTexture(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/replace-with-texture/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setDataTexture({ result_images: [imageURL] });
    } catch (error) {
      console.error("Failed to process:", error);
    } finally {
      setIsLoadingTexture(false);
    }
  };

  return (
    <>
      <div className="h-screen  w-full p-3">
        <div className=" h-full rounded-t-3xl rounded-b-3xl bg-linear-to-t from-[#caddeb] to-[#7c9bc2]">
          <h1 className="runde-600 text-3xl  mx-auto pt-20 text-white w-96 text-center">
            Edit Warna & Teksture Warna secara instant
          </h1>
          <p className="runde-400 mx-auto w-96 text-center text-white pt-4">
            Ubah warna dan tekstur gambar dengan cepat dan mudah. Cocok untuk
            desain, presentasi, atau konten visual—semua bisa dilakukan secara
            instan tanpa ribet.
          </p>
        </div>
      </div>

      {/* padding text */}
      <div className="my-2">
        <p className="runde-600 text-center text-2xl">
          Simple{" "}
          <Image
            height={20}
            width={20}
            alt="icon"
            src="/icon/icon.png"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />{" "}
          Clicks, Stunning Changes.
        </p>
      </div>

      {/* edit masking image */}
      <div className="flex mt-4 gap-3 w-full px-20 ">
        {/* upload image */}
        <div className="w-1/2">
          <ImageUploader onFileChange={(file) => setImageFile(file)} />
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          {/* warna target */}
          <ColorInputBox onColorChange={(color) => setTargetColor(color)} />

          <ToleranceColor onToleranceChange={(value) => setTolerance(value)} />
          <ModeSelector
            mode={mode}
            setMode={setMode}
            onHexFileChange={(file) => setHexFile(file)}
            onTextureFileChange={(file) => setTextureFile(file)}
          />

          {/* Tombol Proses */}
          {mode === "color" ? (
            <button
              onClick={handleClickColor}
              disabled={isButtonDisabled}
              className={`w-full rounded-md transition-all h-[40px] border flex justify-center items-center ${
                isButtonDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "hover:bg-[#b8cce0]"
              }`}
            >
              {isLoading ? "Processing..." : "Process 🎨 With Color"}
            </button>
          ) : mode === "texture" ? (
            <button
              onClick={handleClickTexture}
              className="w-full rounded-md hover:bg-[#b8cce0] transition-all h-[40px] border flex justify-center items-center"
            >
              Process 🧵 With Texture
            </button>
          ) : null}
        </div>
      </div>

      {/* menampilkan data iamge color hasil dari API */}
      <div className="border border-dashed border-gray-300 p-4 mt-5 mx-20">
        {!isLoadingTexture &&
          dataTexture &&
          dataTexture.result_images.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-5">
              {dataTexture.result_images.map((src, index) => (
                <div
                  key={index}
                  className="w-[300px] cursor-pointer hover:opacity-95 transition-transform duration-200"
                  onClick={() => setSelectedImageTexture(src)}
                >
                  <Image
                    src={src}
                    alt={`Texture Result ${index}`}
                    width={300}
                    height={300}
                  />
                </div>
              ))}
            </div>
          )}

        {!isLoading && dataColor && dataColor.result_images.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-5">
            {dataColor.result_images.map((src, index) => {
              const formattedSrc = `${
                process.env.NEXT_PUBLIC_API
              }/${src.replace(/\\/g, "/")}`;
              return (
                <div
                  key={index}
                  className="w-[300px] cursor-pointer hover:opacity-95 transition-transform duration-200"
                  onClick={() =>
                    setSelectedImageColor(`${formattedSrc}?t=${Date.now()}`)
                  }
                >
                  <Image
                    src={`${formattedSrc}?t=${Date.now()}`}
                    alt={`Result ${index}`}
                    width={300}
                    height={300}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* preview & download */}
      {selectedImageColor && (
        <div className="fixed inset-0 z-50 bg-gray-600/75 flex justify-center items-center">
          <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl max-h-[90vh] overflow-auto">
            {/* close btn */}
            <button
              onClick={() => setSelectedImageColor(null)}
              className="absolute top-2 right-2 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ✕
            </button>

            {/* download btn */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownloadImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download Gambar
              </button>
            </div>

            <Image
              src={selectedImageColor}
              alt="Preview"
              width={800}
              height={800}
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* preview dan download texture */}

      {selectedImageTexture && (
        <div className="fixed inset-0 z-50 bg-gray-600/75 flex justify-center items-center">
          <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl max-h-[90vh] overflow-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedImageTexture(null)}
              className="absolute top-2 right-2 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ✕
            </button>

            {/* Download button */}
            <div className="flex justify-center mt-4">
              <a
                href={selectedImageTexture}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download Gambar
              </a>
            </div>

            {/* Preview Image */}
            <Image
              src={`${selectedImageTexture}`}
              alt="Preview Texture"
              width={800}
              height={800}
              className="object-contain mt-4"
            />
          </div>
        </div>
      )}

      <div></div>

      <div className="h-[60px]"></div>
    </>
  );
}
