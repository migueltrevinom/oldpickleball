import type { IPaginationMeta } from '@oldpickleball/shared';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@oldpickleball/shared';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const rawLimit = parseInt(String(query.limit || String(DEFAULT_PAGE_LIMIT)), 10) || DEFAULT_PAGE_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), MAX_PAGE_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(page: number, limit: number, total: number): IPaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
