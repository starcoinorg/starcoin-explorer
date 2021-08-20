// @ts-ignore
import client from '@/utils/client';
import { getNetwork } from '@/utils/helper';

const network = getNetwork();

export const getTokenList = (params: any) => client.get(`v2/token/${params.network ? params.network : network}/stats/${params.page}`);
export const getTokenHolderList = (params: any) => client.get(`v2/token/${params.network ? params.network : network}/holders/page/${params.page}?token_type=${params.token_type_tag}`);
export const getTokenTransactionList = (params: any) => client.get(`v2/transaction/${params.network ? params.network : network}/transfer/byTag/${params.token_type_tag}/page/${params.page}`);
export const getTokenInfo = (params: any) => client.get(`v2/token/${network}/info/${params.token_type_tag}`);