// Client-side image optimizer: downscales and re-encodes to WebP using canvas.
// Landing-page thumbs render at ~200px wide × 224px tall; 600px max covers 2-3x DPR.
const MAX_DIM = 600;
const QUALITY = 0.7;

export async function toOptimizedWebp(
  source: Blob,
  filenameHint = "image",
): Promise<{ blob: Blob; filename: string }> {
  const bitmap = await loadBitmap(source);
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_DIM);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap) (bitmap as ImageBitmap).close();

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
      "image/webp",
      QUALITY,
    );
  });

  const base = filenameHint.replace(/\.[^.]+$/, "");
  return { blob, filename: `${base || "image"}.webp` };
}

async function loadBitmap(src: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(src);
    } catch {
      // fall through
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(src);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image"));
    };
    img.src = url;
  });
}

function fitWithin(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = Math.min(max / w, max / h);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
