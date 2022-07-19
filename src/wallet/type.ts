/*
 * @Descripttion:
 * @version:
 * @Author: xiaziheng
 * @Date: 2022-06-02 10:24:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-04 16:27:28
 */
import { providers } from '@starcoin/starcoin';

export type GetSTCAccountBalance = (
  provider: ProviderStc,
  accounts: string,
  token?: string
  ) => Promise<string>;

export type ProviderStc = providers.Web3Provider;

export type WalletType = 'bsc' | 'stc' | 'unConnected';

export type SendAsyncParams = {
  method: string;
  params?: any[] | undefined;
};

export type SendResult = {
  id: number | null;
  jsonrpc: string | null;
  result: any;
};
