// @ts-ignore
import client from '@/utils/client';

const network = localStorage.getItem('network');

export const getBlock = (params: any) => client.get(`block/${network}/hash/${params.hash}`);
export const getBlockList = (params: any) => client.get(`block/${network}/page/${params.page}`);