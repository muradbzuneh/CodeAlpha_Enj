import type { Request } from "express";

import { auth } from "./auth.js";

export async function getSession(request: Request) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  return auth.api.getSession({ headers });
}
