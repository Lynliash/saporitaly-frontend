// Upload immagini su Cloudinary unsigned: solo cloud name + preset, niente API key/secret nel frontend.
// Config in .env.local (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).
export async function uploadImage(file: File): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloud || !preset) {
    throw new Error(
      "Cloudinary non configurato: imposta NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local (oppure incolla un URL).",
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  // fetch nativo (non axios): servizio esterno, non deve ricevere il nostro JWT.
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Upload su Cloudinary fallito (${res.status}). ${detail}`.trim());
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Risposta Cloudinary senza secure_url");
  }
  return data.secure_url;
}
