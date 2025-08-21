// src/utils/pagination.js
export function pageParams(q) {
  const page = Math.max(1, parseInt(q.page ?? "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(q.pageSize ?? "12")));
  return { page, pageSize, skip:(page-1)*pageSize, take:pageSize };
}
