// @ts-ignore
import client from '@/utils/client';

import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getTransaction = (params: any) => client.get(`transaction/${params.network ? params.network : network}/hash/${params.hash}`);
export const getTransactionList = (params: any) => client.get(`transaction/${params.network ? params.network : network}/page/${params.page}${params.page > 1 && params.after ? `?after=${params.after}` : ''}`);
export const getAddressTransactions = (params: any) => client.get(`transaction/${params.network ? params.network : network}/byAddress/${params.hash}`);
export const getBlockTransactions = (params: any) => client.get(`transaction/${params.network ? params.network : network}/byBlock/${params.hash}`);
export const getBlockTransactionsByHeight = (params: any) => client.get(`transaction/${params.network ? params.network : network}/byBlockHeight/${params.height}`);