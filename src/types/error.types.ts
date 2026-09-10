export type AppError = {
  code: string;
  translationKey: string;
  status?: number;
  retryable: boolean;
};

export type DomainError = Error & {
  code: string;
};
