// @ts-ignore
import client from '@/utils/client';

export const getTransaction = (params: any) => client.get(`transaction/hash/${params.hash}`);