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
    const networks = process.env.REACT_APP_STARCOIN_NETWORKS || '';
    localStorage.setItem('network', networks.split(',')[0]);
  }
  return localStorage.getItem('network');
}

export function isHex(num: string) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i))
}