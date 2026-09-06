import type { Paginated, Pagination } from "@/types/api";

const DEFAULT_LIMIT = 20;

/**
 * Accepts either a bare array or a paginated envelope from the backend and
 * always returns the same shape to the UI.
 */
export function toPaginated<T>(payload: unknown, page: number, limit = DEFAULT_LIMIT): Paginated<T> {
  if (Array.isArray(payload)) {
    return { items: payload as T[], pagination: fallbackPagination(payload.length, page, limit) };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const items = (record["items"] ??
      record["data"] ??
      record["posts"] ??
      record["comments"] ??
      record["users"] ??
      record["likes"] ??
      record["results"]) as unknown;

    if (Array.isArray(items)) {
      const meta = (record["pagination"] ?? record["meta"]) as Record<string, unknown> | undefined;
      const total = numberOrUndefined(meta?.["total"] ?? record["total"]);
      const resolvedLimit = numberOrUndefined(meta?.["limit"] ?? record["limit"]) ?? limit;
      const resolvedPage = numberOrUndefined(meta?.["page"] ?? record["page"]) ?? page;
      const hasMore =
        typeof meta?.["hasMore"] === "boolean"
          ? (meta["hasMore"] as boolean)
          : typeof record["hasMore"] === "boolean"
            ? (record["hasMore"] as boolean)
            : total !== undefined
              ? resolvedPage * resolvedLimit < total
              : items.length >= resolvedLimit;

      const pagination: Pagination = {
        page: resolvedPage,
        limit: resolvedLimit,
        hasMore,
        ...(total !== undefined ? { total } : {}),
        ...(record["nextCursor"] !== undefined
          ? { nextCursor: record["nextCursor"] as string | null }
          : {}),
      };
      return { items: items as T[], pagination };
    }
  }

  return { items: [], pagination: fallbackPagination(0, page, limit) };
}

function fallbackPagination(count: number, page: number, limit: number): Pagination {
  return { page, limit, hasMore: count >= limit };
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
