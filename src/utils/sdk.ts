// https://www.npmjs.com/package/@starcoin/starcoin
import { providers } from '@starcoin/starcoin';
import { getNetwork } from '@/utils/helper';

const networks: string[] =
  process.env.REACT_APP_STARCOIN_NETWORKS?.split(',') || [];
const providerMap: Record<string, providers.JsonRpcProvider> = {};
networks.forEach((n) => {
  providerMap[n] = new providers.JsonRpcProvider(
    `https://${n}-seed.starcoin.org`,
  );
});

export async function getTxnData(txnHash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getTransaction(txnHash);
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressData(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getResource(hash, '0x1::Account::Account');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressResources(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getResources(hash);
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function listResources(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.send('state.list_resource', [hash, { decode: true }]);
    return result;
  } catch (error: any) {
    console.info(error);
    return false;
  }
}


export async function getBalancesData(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getBalances(hash);
    let balanceList: any = [];
    let tokenInfoList: any = [];
    if (result) {
      for (const value of Object.keys(result)) {
        const resource = getTokenPrecision(value)
        // @ts-ignore
        tokenInfoList.push(resource)
      }
    }
    tokenInfoList = await Promise.all(tokenInfoList)
    console.info(tokenInfoList)
    let index = 0;
    if (result) {
      for (const value of Object.keys(result)) {
        balanceList.push({
          name: value,
          amount: result[value],
          scaling_factor: tokenInfoList[index++][0],
        });
      }
    }

    return balanceList;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressSTCBalance(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getResource(
      hash,
      '0x1::Account::Balance<0x1::STC::STC>',
    );
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressModuleUpdateStrategy(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.callV2({
      function_id: '0x1::PackageTxnManager::get_module_upgrade_strategy',
      type_args: [],
      args: [hash],
    });
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressUpgradePlanCapability(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getResource(
      hash,
      '0x1::PackageTxnManager::UpgradePlanCapability',
    );
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressUpgradeModuleCapability(hash: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getResource(
      hash,
      '0x1::UpgradeModuleDaoProposal::UpgradeModuleCapability',
    );
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getEpochData() {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.getResource('0x1', '0x1::Epoch::Epoch');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getNodeInfo() {
  try {
    const provider = providerMap[getNetwork()];
    const nodeInfo = await provider.perform("getNodeInfo", undefined);
    return nodeInfo
  } catch (error: any) {
    console.error(error)
    return false;
  }
}

export async function getTokenPrecision(tokenTypeTag: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.callV2({
      function_id: '0x1::Token::scaling_factor',
      type_args: [tokenTypeTag],
      args: [],
    });
    return result;
  } catch (error: any) {
    return false;
  }
}


export async function getAddressStateCode(address: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.send('state.list_code', [address]);
    return result;
  } catch (error: any) {
    return false;
  }
}


export async function getStateCode(module_id: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.send('state.get_code', [module_id]);
    return result;
  } catch (error: any) {
    console.info(error);
    return false;
  }
}

export async function getResolveModule(module_id: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.send('contract.resolve_module', [module_id]);
    return result;
  } catch (error: any) {
    console.info(error);
    return false;
  }
}

export async function getResolveStruct(struct_tag: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.send('contract.resolve_struct', [struct_tag]);
    return result;
  } catch (error: any) {
    console.info(error);
    return false;
  }
}

export async function getResolveFunction(function_id: string) {
  try {
    const provider = providerMap[getNetwork()];
    const result = await provider.send('contract.resolve_function', [function_id]);
    return result;
  } catch (error: any) {
    console.info(error);
    return false;
  }
}

export async function getAddressCode(address: string) {
  const { codes } = await getAddressStateCode(address);
  let codeList: any = [];
  for (const value of Object.keys(codes)) {
    codeList.push(getResolveModule(`${address}::${value}`));
  }
  const all = await Promise.all(codeList);
  return Object.keys(codes).map((value, index) => {
    return { 'name': value, code: all[index] };
  });
}