// @ts-ignore
import client from '@/utils/client';

export const getBlock = (params: any) => client.get(`block/hash/${params.hash}`);
export const getBlockList = (params: any) => client.get(`block/page/${params.page}`);