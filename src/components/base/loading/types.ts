import type { ReactNode } from "react";

export type BaseLoadingProps = {
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "section" | "page";
  className?: string;
};
