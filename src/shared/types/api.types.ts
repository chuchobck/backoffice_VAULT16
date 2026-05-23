// ─── API Response shape ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// ─── Common query params ──────────────────────────────────────────────────────

export interface PageParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  includeInactive?: boolean
}
