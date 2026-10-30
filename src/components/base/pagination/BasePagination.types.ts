export type BasePaginationProps = {
  currentPage?: number;
  defaultCurrentPage?: number;
  totalItems?: number;
  totalPages?: number;
  onChange: (currentPage: number) => void;
};
