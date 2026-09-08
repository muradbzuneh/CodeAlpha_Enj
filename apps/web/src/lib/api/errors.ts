import type { ApiError } from "@/types/api";

export class ApiRequestError extends Error implements ApiError {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiRequestError";
    this.status = error.status;
    if (error.code !== undefined) this.code = error.code;
    if (error.fieldErrors !== undefined) this.fieldErrors = error.fieldErrors;
  }
}

/** Turn any thrown value into a message a human can read. */
export function toUserMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiRequestError) return error.message;
  if (error instanceof TypeError) return "Can't reach the server. Check your connection and try again.";
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 401;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "That request wasn't valid. Please check the form and try again.",
  401: "Please sign in to continue.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists. Try a different value.",
  422: "Some fields need attention before you can continue.",
  429: "You're going a bit fast. Please wait a moment.",
  500: "Something went wrong. Please try again.",
};

export function messageForStatus(status: number, path: string): string {
  if (status === 404 && path.includes("/posts/")) return "Post not found.";
  if (status === 409 && (path.includes("/profile") || path.includes("sign-up")))
    return "That username is already taken.";
  return STATUS_MESSAGES[status] ?? STATUS_MESSAGES[500]!;
}
