// @ts-ignore
import client from '@/utils/client';
import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getBlock = (params: any) => client.get(`block/${network}/hash/${params.hash}`);
export const getBlockByHeight = (params: any) => client.get(`block/${network}/height/${params.height}`);
export const getBlockList = (params: any) => client.get(`block/${params.network ? params.network : network}/page/${params.page}${params.total ? `?total=${params.total}` : ''}`);