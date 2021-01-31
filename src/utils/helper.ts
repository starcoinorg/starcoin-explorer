import {INIT_NETWORK} from "@/utils/constants";

export function withBaseRoute(route: any = '') {
  // TODO: add logging/tracing code here

  if (typeof route === 'object' && 'pathname' in route) {
    return {
      ...route,
      pathname: `${route.pathname}`
    }
  }
  return route;
}

export function getNetwork() {
  const network = localStorage.getItem('network');
  if (!network) {
    localStorage.setItem('network', INIT_NETWORK);
  }
  return localStorage.getItem('network');
}