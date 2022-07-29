import BigNumber from 'bignumber.js';
import { isValidAddress } from '@starcoin/stc-util'

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
export function isAddress(value: any): string | false {
  try {
    return isValidAddress((value as string).split('::')[0]) && value
  } catch {
    return false
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function getNetwork() {
  try {
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
  } catch (error) {
    console.log(error)
    const networks = '';
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

}

export function isHex(num: string) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

export function isReceiptIdentifier(arg: string) {
  return Boolean(arg.toLowerCase().startsWith('stc'));
}

export function formatBalance(num: string | number, fixed?: number ) {
  const value = new BigNumber(num);
  const convertedValue = value.div(1000000000).toFormat(fixed);
  return convertedValue;
}

// formatToken
export function formatTokenName(input: string) {
  try {
    if (input.includes(",")) {
      try {
        const tokenSlice = input.slice(input.indexOf("<"), input.indexOf(">"))
        const tokenArray = tokenSlice.split(",")
        const token1 = tokenArray[0].split('::')[2]
        const token2 = tokenArray[1].split('::')[2]
        const token = input.split('::')[2].slice(0, input.split('::')[2].indexOf("<"))
        return `${token}<${token1},${token2}>`
      } catch (e) {
        console.info(e)
        return input.split('::')[2]
      }
    } else {
      return input.split('::')[2]
    }
  } catch (e) {
    return input
  }
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

export function setLocalTheme(data: string): any {
  localStorage.setItem('theme', data);
}

export function getLocalTheme(): any {
  return localStorage.getItem('theme');
}


