import { useCallback, useMemo, useState } from "react";

import {
  DEFAULT_NUMBER_ZERO,
  EMPTY_STRING,
  PRODUCT_SHEET_PAGE_SIZE,
} from "@/utils/constants";
import { searchProductSheetRows } from "../helpers";
import type {
  ProductSheetHighlightedRowVariant,
  ProductSheetRow,
} from "../components/ProductSpreadsheet/types";

export const useProductSheetSearch = (
  rows: ProductSheetRow[],
  onPageChange: (page: number) => void,
) => {
  const [searchKeyword, setSearchKeyword] = useState(EMPTY_STRING);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] =
    useState(DEFAULT_NUMBER_ZERO);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );
  const [highlightedRowVariant, setHighlightedRowVariant] =
    useState<ProductSheetHighlightedRowVariant>("search");

  const searchResultIndexes = useMemo(
    () => searchProductSheetRows(rows, searchKeyword),
    [rows, searchKeyword],
  );

  const focusRow = useCallback(
    (
      rowIndex: number,
      variant: ProductSheetHighlightedRowVariant = "search",
    ) => {
      onPageChange(Math.floor(rowIndex / PRODUCT_SHEET_PAGE_SIZE));
      setHighlightedRowIndex(rowIndex);
      setHighlightedRowVariant(variant);
    },
    [onPageChange],
  );

  const handleKeywordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextKeyword = event.target.value;
      const nextIndexes = searchProductSheetRows(rows, nextKeyword);
      const firstMatchedRowIndex = nextIndexes[DEFAULT_NUMBER_ZERO];

      setSearchKeyword(nextKeyword);
      setCurrentSearchResultIndex(DEFAULT_NUMBER_ZERO);

      if (!nextKeyword.trim() || typeof firstMatchedRowIndex !== "number") {
        setHighlightedRowIndex(null);
        setHighlightedRowVariant("search");
        return;
      }

      focusRow(firstMatchedRowIndex);
    },
    [focusRow, rows],
  );

  const handlePreviousResult = useCallback(() => {
    if (searchResultIndexes.length === DEFAULT_NUMBER_ZERO) return;

    const nextIndex =
      currentSearchResultIndex === DEFAULT_NUMBER_ZERO
        ? searchResultIndexes.length - 1
        : currentSearchResultIndex - 1;

    setCurrentSearchResultIndex(nextIndex);
    focusRow(searchResultIndexes[nextIndex]);
  }, [currentSearchResultIndex, focusRow, searchResultIndexes]);

  const handleNextResult = useCallback(() => {
    if (searchResultIndexes.length === DEFAULT_NUMBER_ZERO) return;

    const nextIndex =
      currentSearchResultIndex >= searchResultIndexes.length - 1
        ? DEFAULT_NUMBER_ZERO
        : currentSearchResultIndex + 1;

    setCurrentSearchResultIndex(nextIndex);
    focusRow(searchResultIndexes[nextIndex]);
  }, [currentSearchResultIndex, focusRow, searchResultIndexes]);

  const syncAfterDataChange = useCallback(
    (nextRows: ProductSheetRow[]) => {
      if (highlightedRowVariant !== "search" || !searchKeyword.trim()) return;

      const nextIndexes = searchProductSheetRows(nextRows, searchKeyword);

      if (nextIndexes.length === DEFAULT_NUMBER_ZERO) {
        setCurrentSearchResultIndex(DEFAULT_NUMBER_ZERO);
        setHighlightedRowIndex(null);
        return;
      }

      setCurrentSearchResultIndex((currentIndex) =>
        Math.min(currentIndex, nextIndexes.length - 1),
      );

      if (
        highlightedRowIndex === null ||
        !nextIndexes.includes(highlightedRowIndex)
      ) {
        setHighlightedRowIndex(null);
      }
    },
    [highlightedRowIndex, highlightedRowVariant, searchKeyword],
  );

  const resetHighlight = useCallback(() => {
    setHighlightedRowIndex(null);
    setHighlightedRowVariant("search");
  }, []);

  return {
    searchKeyword,
    searchResultIndexes,
    currentSearchResultIndex,
    highlightedRowIndex,
    highlightedRowVariant,
    setHighlightedRowIndex,
    setHighlightedRowVariant,
    focusRow,
    resetHighlight,
    syncAfterDataChange,
    handleKeywordChange,
    handlePreviousResult,
    handleNextResult,
  };
};
