// @ts-ignore
import client from '@/utils/client';

import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getTransaction = (params: any) => client.get(`v2/transaction/${network}/hash/${params.hash}`);
export const getPendingTransaction = (params: any) => client.get(`v2/transaction/pending_txn/get/${network}/${params.hash}`);
export const getTransactionList = (params: any) => client.get(`v2/transaction/${params.network ? params.network : network}/page/${params.page}${params.page > 1 && params.after ? `?after=${params.after}` : ''}`);
export const getPendingTransactionList = (params: any) => client.get(`v2/transaction/pending_txns/${params.network ? params.network : network}/page/${params.page}`);
export const getAddressTransactions = (params: any) => client.get(`v2/transaction/${network}/byAddress/${params.hash}`);
export const getAddressTransactionList = (params: any) => client.get(`v2/transaction/address/${network}/${params.hash}/page/${params.page}`);
export const getBlockTransactions = (params: any) => client.get(`v2/transaction/${network}/byBlock/${params.hash}`);
export const getBlockTransactionsByHeight = (params: any) => client.get(`v2/transaction/${network}/byBlockHeight/${params.height}`);