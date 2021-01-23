// @ts-ignore
import client from '@/utils/client';

export const getTransaction = (params: any) => client.get(`transaction/hash/${params.hash}`);
export const getTransactionList = (params: any) => client.get(`transaction/page/${params.page}`);
export const getAddresssTransactions = (params: any) => client.get(`transaction/byAddress/${params.hash}`);