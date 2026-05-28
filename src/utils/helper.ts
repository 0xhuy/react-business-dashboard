import type { IRouteModel } from "./interfaces";

/**
 * Determines if the current path is a nested route of the parent path.
 * @param parentPath The parent route path to check against.
 * @param currentPath The current route path to be evaluated.
 * @returns True if the current path is a nested route of the parent path and not exactly the same as the parent path, false otherwise.
 */
export const isNestedRoute = (
  parentPath: string,
  currentPath: string,
): boolean => {
  return currentPath.startsWith(parentPath) && currentPath !== parentPath;
};

/**
 * Checks if a route has an active child route based on the provided location pathname.
 * @param route The route object to check.
 * @param locationPathname The pathname of the current location.
 * @returns True if the route has an active child route, false otherwise.
 */
export const hasActiveChild = (
  route: IRouteModel,
  locationPathname: string,
): boolean => {
  return (
    route.children?.some(
      (child) =>
        child.path === locationPathname ||
        isNestedRoute(child.path, locationPathname) ||
        hasActiveChild(child, locationPathname),
    ) || route.path === locationPathname
  );
};
