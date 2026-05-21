import type { ElementType } from "react";
import type { Role } from "@/utils/enum";

export interface IRouteModel {
  index?: boolean;
  path: string;
  component: ElementType;
  children?: IRouteModel[];
  name?: string;
  icon?: string;
  iconActive?: string;
  role?: Role;
}
