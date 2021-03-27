// https://www.npmjs.com/package/@starcoin/starcoin
import { providers } from '@starcoin/starcoin';

const network = localStorage.getItem('network');
const nodeUrl = `http://${network}.seed.starcoin.org:9850`;
// let ip;
// switch (network) {
//   case 'barnard':
//     ip = '39.102.35.25';
//     break;
//   case 'halley':
//     ip = '39.102.35.25';
//     break;
//   case 'promima':
//     ip = '39.102.35.25';
//     break;
// }
// const nodeUrl = `http://${ip}:9850`;
const provider = new providers.JsonrpcProvider(nodeUrl);

export async function getTxnData(txnHash: string) {
  try {
    const result = await provider.getTransaction(txnHash);
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressData(hash: string) {
  try {
    const result = await provider.getResource(hash, '0x1::Account::Account');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getBalancesData(hash: string) {
  try {
    const result = await provider.getBalances(hash);
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getEpochData() {
  try {
    console.log('getEpochData');
    const result = await provider.getResource('0x1', '0x1::Epoch::Epoch');
    return result;
  } catch (error: any) {
    return false;
  }
}
