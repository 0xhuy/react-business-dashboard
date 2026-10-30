// ===== Libs =====
import type { ElementType } from "react";

// ===== Types =====
export type RouteConfig = {
  index?: boolean;
  path: string;
  component: ElementType;
  children?: RouteConfig[];
  name?: string;
  icon?: string;
  iconActive?: string;
  hidden?: boolean;
};
