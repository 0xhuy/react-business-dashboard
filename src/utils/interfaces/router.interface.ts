export interface IRouteModel {
  index?: boolean;
  path: string;
  component: React.ElementType;
  children?: IRouteModel[];
  name?: string;
  icon?: string;
  iconActive?: string;
}
