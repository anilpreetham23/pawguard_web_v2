/**
 * Pagination helpers shared by list UIs (cards, tables, filters).
 */

import type { PaginationMeta } from "./types";

/** Clamp a page number to a valid range (1..totalPages). */
export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(page, Math.max(1, totalPages));
}

/** Total number of pages for a given total/size. */
export function getPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}

/** First item index (0-based) for a page, for slicing an array client-side. */
export function getPageOffset(page: number, pageSize: number): number {
  return (Math.max(1, page) - 1) * Math.max(1, pageSize);
}

/**
 * Page numbers to render around the current page, e.g. `[1, 4, 5, 6, 9]`.
 * `delta` is the number of neighbours to show on each side of the current page.
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  delta = 1
): number[] {
  const safePage = clampPage(currentPage, totalPages);
  const pages = new Set<number>([1, totalPages]);
  for (let i = safePage - delta; i <= safePage + delta; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

/** Standard `{ page, page_size }` query params for a request. */
export function getPaginationParams(
  page: number,
  pageSize: number
): { page: number; page_size: number } {
  return { page: Math.max(1, page), page_size: Math.max(1, pageSize) };
}

/** Empty `PaginationMeta` to use before a response arrives. */
export function getEmptyPaginationMeta(): PaginationMeta {
  return { total: 0, page: 1, page_size: 0, total_pages: 0 };
}
