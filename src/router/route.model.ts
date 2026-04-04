import type { ElementType } from "react";

export interface IRouteModel {
  index?: boolean;
  path: string;
  component: ElementType;
  children?: IRouteModel[];
  name?: string;
  icon?: string;
  iconActive?: string;
  role?: string;
}
