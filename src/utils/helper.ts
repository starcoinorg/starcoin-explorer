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

export function hexToArrayBuffer (hex: string) {
  if (typeof hex !== 'string') {
    return new Uint8Array(0);
  }

  if (hex.startsWith('0x')){
    hex = hex.slice(2);
  }

  if ((hex.length % 2) !== 0) {
    return new Uint8Array(0);
  }

  var view = new Uint8Array(hex.length / 2)

  for (var i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }

  return view
}