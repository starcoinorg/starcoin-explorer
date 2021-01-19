// https://www.npmjs.com/package/@starcoin/starcoin
import { providers } from '@starcoin/starcoin';

const nodeUrl = process.env.REACT_APP_STARCOIN_NODE_URL;
const provider = new providers.JsonrpcProvider(nodeUrl);

export async function getTxnData(txnHash: string) {
  const result = await provider.getTransaction(txnHash);
  return result;
}

export async function getTxnInfoData(txnHash: string) {
  const result = await provider.getTransactionInfo(txnHash);
  return result;
}
