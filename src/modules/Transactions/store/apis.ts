// @ts-ignore
import client from '@/utils/client';

import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getTransaction = (params: any) => client.get(`transaction/${network}/hash/${params.hash}`);
export const getTransactionList = (params: any) => client.get(`transaction/${network}/page/${params.page}`);
export const getAddressTransactions = (params: any) => client.get(`transaction/${network}/byAddress/${params.hash}`);
export const getBlockTransactions = (params: any) => client.get(`transaction/${network}/byBlock/${params.hash}`);
export const getBlockTransactionsByHeight = (params: any) => client.get(`transaction/${network}/byBlockHeight/${params.height}`);