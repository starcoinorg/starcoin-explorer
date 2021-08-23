// @ts-ignore
import client from '@/utils/client';
import seedClient from '@/utils/seed-client';
import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getBlock = (params: any) =>
  client.get(`v2/block/${network}/hash/${params.hash}`);
export const getUncleBlock = (params: any) =>
  client.get(`v2/block/${network}/uncle/hash/${params.hash}`);
export const getBlockByHeight = (params: any) =>
  client
    .get(`v2/block/${network}/height/${params.height}`)
    .then(
      (data?: unknown) =>
        data ||
        seedClient.call('chain.get_block_by_number', [parseInt(params.height)]),
    );
export const getUncleBlockByHeight = (params: any) =>
  client.get(`v2/block/${network}/uncle/height/${params.height}`);
export const getBlockList = (params: any) =>
  client.get(
    `v2/block/${params.network ? params.network : network}/page/${params.page}${
      params.total ? `?total=${params.total}` : ''
    }`,
  );
export const getUncleBlockList = (params: any) =>
  client.get(
    `v2/block/${params.network ? params.network : network}/uncle/page/${
      params.page
    }`,
  );
