import { providers, encoding, types, bcs, serde } from '@starcoin/starcoin';
import { arrayify } from '@ethersproject/bytes';
import formatNumber from '@/utils/formatNumber';

export const csvExport = (source: any, network: string, that: any) => {
  let payloadInHex = '';
  let sender = '';
  if (source.user_transaction && source.user_transaction.raw_txn) {
    payloadInHex = source.user_transaction.raw_txn.payload;
    sender = source.user_transaction.raw_txn.sender;
  }
  const txnPayload = payloadInHex
    ? encoding.decodeTransactionPayload(payloadInHex)
    : [];
  const type = Object.keys(txnPayload)[0];

  let args: any;
  let txn_type_args: any;
  let functionId: any;
  let moduleAddress: any;
  let moduleName: any;
  let functionName: any;

  if ('ScriptFunction' in txnPayload) {
    args = txnPayload.ScriptFunction.args;
    txn_type_args = txnPayload.ScriptFunction.ty_args;
    const func = txnPayload.ScriptFunction.func as {
      address: types.AccountAddress;
      module: types.Identifier;
      functionName: types.Identifier;
    };
    moduleAddress = func.address;
    moduleName = func.module;
    functionName = func.functionName;
    functionId = `${moduleAddress}::${moduleName}::${functionName}`;
  }
  if ('Package' in txnPayload) {
    if (txnPayload.Package.init_script) {
      args = txnPayload.Package.init_script.args;
      txn_type_args = txnPayload.Package.init_script.ty_args;
      const func = txnPayload.Package.init_script.func as {
        address: types.AccountAddress;
        module: types.Identifier;
        functionName: types.Identifier;
      };
      moduleAddress = func.address;
      moduleName = func.module;
      functionName = func.functionName;
      functionId = `${moduleAddress}::${moduleName}::${functionName}`;
    }
  }

  let csvRow = '';

  const savData = [
    source.transaction_hash,
    type,
    `${new Date(parseInt(source.timestamp, 10)).toLocaleString()} ${new Date()
      .toTimeString()
      .slice(9)}`,
    source.block_hash,
    source.block_number,
    source.state_root_hash,
    source.status,
    source.gas_used,
    sender,
    moduleAddress,
    moduleName,
    functionName,
    JSON.stringify(txn_type_args[0] || []),
  ];

  const provider = new providers.JsonRpcProvider(
    `https://${network}-seed.starcoin.org`,
  );
  const getResolvedFunction = async () => {
    const data = await provider.send('contract.resolve_function', [functionId]);
    that.setState({ resolvedFunction: data });
  };
  const resolvedFunction = that.state?.resolvedFunction;
  if (!resolvedFunction) {
    getResolvedFunction();
  }

  const decodedArgs = args
    ? args.map((arg: string, index: number) => {
        const type_tag = resolvedFunction?.args[index + 1]?.type_tag;
        return resolvedFunction?.args[index + 1]
          ? [
              types.formatTypeTag(type_tag),
              type_tag !== 'Address'
                ? formatArgsWithTypeTag(
                    new bcs.BcsDeserializer(arrayify(arg)),
                    resolvedFunction.args[index + 1].type_tag,
                  )
                : arg,
            ]
          : arg;
      })
    : {};

  for (let i = 0; i < decodedArgs.length; i++) {
    savData.push(decodedArgs[i][1]);
  }

  for (let index = 0; index < savData.length; index++) {
    const element = savData[index];
    csvRow += `"${element}",`;
  }

  return csvRow;
};

export function formatArgsWithTypeTag(
  deserializer: serde.Deserializer,
  typeTag: types.TypeTag,
): string | undefined {
  try {
    if (typeof typeTag === 'string') {
      switch (typeTag) {
        case 'Signer':
        case 'Address': {
          let decodeAddress: string = '0x';
          for (let i = 0; i < 16; i++) {
            decodeAddress += deserializer.deserializeU8().toString(16);
          }
          return decodeAddress;
        }
        case 'Bool': {
          return deserializer.deserializeBool() ? 'true' : 'false';
        }
        case 'U128': {
          return formatNumber(deserializer.deserializeU128() as bigint);
        }
        case 'U64': {
          return formatNumber(deserializer.deserializeU64() as bigint);
        }
        case 'U8': {
          return formatNumber(deserializer.deserializeU8());
        }
        default: {
          return undefined;
        }
      }
    }
    if ('Vector' in typeTag) {
      const length = deserializer.deserializeLen();
      return `[${Array.from({ length })
        .map(() => formatArgsWithTypeTag(deserializer, typeTag.Vector))
        .join(', ')}]`;
      // return hexlify(deserializer.deserializeBytes());
    }
    if ('Struct' in typeTag) {
      return `${typeTag.Struct.address}::${typeTag.Struct.module}::${
        typeTag.Struct.name
      }${
        typeTag.Struct.type_params
          ? `<${typeTag.Struct.type_params
              .map((param) => formatArgsWithTypeTag(deserializer, param))
              .join(', ')}>`
          : ''
      }`;
    }
    return undefined;
  } catch {
    return undefined;
  }
}
