import BigNumber from 'bignumber.js';

export function withBaseRoute(route: any = '') {
  // TODO: add logging/tracing code here

  if (typeof route === 'object' && 'pathname' in route) {
    return {
      ...route,
      pathname: `${route.pathname}`,
    };
  }
  return route;
}

export function getNetwork() {
  const networks = process.env.REACT_APP_STARCOIN_NETWORKS || '';
  const networkArr = networks.split(',');
  const networkInPath = window.location.pathname.split('/')[1];
  let network =
    (networkArr.includes(networkInPath) && networkInPath) ||
    localStorage.getItem('network');
  if (!network) {
    localStorage.setItem('network', networkArr[0]);
    network = networkArr[0];
  }
  return network;
}

export function isHex(num: string) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

export function formatBalance(num: string | number) {
  const value = new BigNumber(num);
  const convertedValue = value.div(1000000000).toFormat();
  return convertedValue;
}

export function toObject(data: {}): string {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
}

export function formatResources(data: any): any {
  let resourcesArray = [];
  let itemKey = '';
  let itemValue = '';
  const allKeys = Object.keys(data);
  for (let i = 0; i < allKeys.length; i++) {
    itemKey = allKeys[i];
    let itemArray = [itemKey];
    // itemValue = JSON.stringify(data[itemKey]);
    itemValue = toObject(data[itemKey]);
    itemArray.push(itemValue);
    resourcesArray.push(itemArray);
  }
  return resourcesArray;
}
