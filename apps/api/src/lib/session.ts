import type { Request } from "express";

import { auth } from "./auth.js";

export async function getSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}