import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const image = formData.get("image") as File;
  const targetColor = formData.get("target_color");
  const texture = formData.get("texture") as File;
  const tolerance = formData.get("tolerance");

  if (!image || !texture || !targetColor || !tolerance) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  // Buat FormData untuk dikirim ke backend FastAPI
  const backendFormData = new FormData();
  backendFormData.append("image", image);
  backendFormData.append("target_color", targetColor as string);
  backendFormData.append("texture", texture);
  backendFormData.append("tolerance", tolerance as string);

  // Kirim ke backend FastAPI
  const backendRes = await fetch(
    "http://localhost:8000/replace-with-texture/",
    {
      method: "POST",
      body: backendFormData,
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json({ error: "Backend failed" }, { status: 500 });
  }

  const data = await backendRes.json();

  return NextResponse.json({ result_images: data.result_images });
}
