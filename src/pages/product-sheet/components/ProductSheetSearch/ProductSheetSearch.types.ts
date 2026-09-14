export type ProductSheetSearchProps = {
  searchKeyword: string;
  searchResultIndexes: number[];
  currentSearchResultIndex: number;
  onSearchKeywordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPreviousSearchResult: () => void;
  onNextSearchResult: () => void;
};
