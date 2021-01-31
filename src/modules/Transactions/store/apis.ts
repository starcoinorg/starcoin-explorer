// @ts-ignore
import client from '@/utils/client';

const network = localStorage.getItem('network');

export const getTransaction = (params: any) => client.get(`transaction/${network}/hash/${params.hash}`);
export const getTransactionList = (params: any) => client.get(`transaction/${network}/page/${params.page}`);
export const getAddresssTransactions = (params: any) => client.get(`transaction/${network}/byAddress/${params.hash}`);
export const getBlockTransactions = (params: any) => client.get(`transaction/${network}/byBlock/${params.hash}`);