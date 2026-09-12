import { API_BASE_URL } from "./api/client";

export async function uploadFile(file: File): Promise<{ url: string; type: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Upload failed");
  }

  const result = await response.json();
  return { url: result.data.url, type: result.data.type };
}
