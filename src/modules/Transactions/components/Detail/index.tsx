import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formatNumber from '@/utils/formatNumber';
import CommonLink from '@/common/Link';
import PageView from '@/common/View/PageView';
import EventViewTable from '@/common/View/EventViewTable';
import Loading from '@/common/Loading';
import Error404 from 'modules/Error404/address';
import { withStyles, createStyles } from '@mui/styles';
import {
  providers,
  onchain_events,
  encoding,
  types,
  bcs,
  serde,
} from '@starcoin/starcoin';
import { arrayify, hexlify } from '@ethersproject/bytes';
import get from 'lodash/get';
// import { formatBalance, toObject } from '@/utils/helper';
import { toObject } from '@/utils/helper';
import BaseRouteLink from '@/common/BaseRouteLink';
import useSWR from 'swr';

function formatArgsWithTypeTag(
  deserializer: serde.Deserializer,
  typeTag: types.TypeTag,
): string | undefined {
  try {
    if (typeof typeTag === 'string') {
      switch (typeTag) {
        case 'Signer':
        case 'Address': {
          return hexlify(deserializer.deserializeBytes());
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
      /*
      const length = deserializer.deserializeLen();
      return `[${Array.from({ length })
        .map(() => formatArgsWithTypeTag(deserializer, typeTag.Vector))
        .join(', ')}]`;
      */
      return hexlify(deserializer.deserializeBytes());
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

export function useResolveFunction(functionId?: string, network?: string) {
  const provider = new providers.JsonRpcProvider(
    `https://${network}-seed.starcoin.org`,
  );
  return useSWR<{
    args: { name: string; type_tag: types.TypeTag; doc: string }[];
  }>(
    functionId
      ? [provider.connection.url, 'resolve_function', functionId]
      : null,
    () => provider.send('contract.resolve_function', [functionId]),
  );
}

const DecodedPayloadContent = ({
                                 network,
                                 txnPayload,
                                 alt,
                               }: {
  network: string;
  alt: string;
  txnPayload: any;
}) => {

  let functionId: any;
  let args: any;
  if ('ScriptFunction' in txnPayload) {
    const func = txnPayload.ScriptFunction.func;
    args = txnPayload.ScriptFunction.args;
    const { address, module, functionName } = func;
    functionId = `${address}::${module}::${functionName}`;
  }
  if ('Package' in txnPayload) {
    if (txnPayload.Package.init_script) {
      const func = txnPayload.Package.init_script.func;
      args = txnPayload.Package.init_script.args;
      const { address, module, functionName } = func;
      functionId = `${address}::${module}::${functionName}`;
    }
  }
  // const functionId = `${address}::${module}::${functionName}`;
  const { data: resolvedFunction } = useResolveFunction(functionId, network);
  const decodedArgs = args ? args.map((arg: string, index: number) => {
    const type_tag = resolvedFunction?.args[index + 1]?.type_tag;
    return resolvedFunction?.args[index + 1]
      ? `${types.formatTypeTag(resolvedFunction.args[index + 1]?.type_tag)}: ${
        type_tag !== 'Address' ? formatArgsWithTypeTag(
          new bcs.BcsDeserializer(arrayify(arg)),
          resolvedFunction.args[index + 1]?.type_tag,
        ) : arg
      }`
      : arg;
  }) : {};
  // txnPayload.ScriptFunction.args = decodedArgs;
  if ('ScriptFunction' in txnPayload) {
    txnPayload.ScriptFunction.args = decodedArgs;
  }
  if ('Package' in txnPayload) {
    if (txnPayload.Package.init_script) {
      txnPayload.Package.init_script.args = decodedArgs;
    }
  }

  return (
    <pre>{JSON.stringify(txnPayload, null, 2)}</pre> || (
      <Typography variant='body1'>{alt}</Typography>
    )
  );
};

const useStyles = (theme: any) =>
  createStyles({
    table: {
      width: '100%',
      display: 'block',
    },
    shrinkMaxCol: {
      flex: '1 100 auto',
      minWidth: 60,
    },
    shrinkCol: {
      flex: '1 10 auto',
    },
    rawData: {
      wordBreak: 'break-all',
      overflow: 'auto',
    },
    accordion: {
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : undefined,
      color: theme.palette.getContrastText(theme.palette.background.paper),
    },
  });

interface IndexState {
  resolvedFunction: any;
}

interface IndexProps {
  classes: any;
  t: any;
  match: any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    transaction: null,
    getTransaction: () => {
    },
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getTransaction({ hash });
  }

  generateExtra() {
    const { transaction, classes, t, match } = this.props;
    const network = match.params.network;
    const isInitialLoad = !transaction;
    const events = get(transaction, 'events', []);
    const eventsTable: any[] = [];

    for (let i = 0; i < events.length; i++) {
      const columns: any[] = [];
      const event = events[i];

      let type_tag = event.type_tag;

      // '0x00000000000000000000000000000001::Oracle::OracleUpdateEvent<0x07fa08a855753f0ff7292fdcbe871216::BTC_USD::BTC_USD, u128>'
      type_tag = type_tag.replace(/<[^<]*?>/g, (str: string) => str.replace(/::/g, '-'));
      const eventTypeArray = (type_tag.split('::')).map((v: string) => v.replace(/-/g, '::'));
      const eventModule = eventTypeArray[1];
      const eventName = eventTypeArray[2];

      // const eventModule = 'Account';
      // const eventName = 'WithdrawEvent';
      let eventDataDetail;
      let eventKeyDetail;
      try {
        const de = onchain_events.decodeEventData(eventName, event.data);
        eventDataDetail = toObject(de.toJS());
      } catch (e) {
        console.log('decode event data error');
        eventDataDetail = event.data;
      }

      try {
        const eventKeyInHex = event.event_key;
        const de = onchain_events.decodeEventKey(eventKeyInHex);
        eventKeyDetail = toObject(de);
      } catch (e) {
        console.log('decode event key error');
        eventKeyDetail = event.event_key;
      }
      columns.push([t('event.Data'), eventDataDetail]);
      columns.push([t('event.Module'), eventModule]);
      columns.push([t('event.Name'), eventName]);
      columns.push([t('event.Key'), eventKeyDetail]);
      columns.push([t('event.Seq'), formatNumber(event.event_seq_number)]);
      eventsTable.push(
        <EventViewTable key={event.event_key} columns={columns} />,
      );
    }

    const source = transaction;
    let payloadInHex = '';
    if (source.user_transaction && source.user_transaction.raw_txn) {
      payloadInHex = source.user_transaction.raw_txn.payload;
    }
    const txnPayload = payloadInHex
      ? encoding.decodeTransactionPayload(payloadInHex)
      : [];

    const eventsContent = events.length ? (
      eventsTable
    ) : (
      <Typography variant='body1'>{t('event.NoEventData')}</Typography>
    );
    const rawContent = <pre>{JSON.stringify(transaction, null, 2)}</pre> || (
      <Typography variant='body1'>{t('transaction.NoRawData')}</Typography>
    );
    /* const decodedPayloadContent = (
      <pre>{JSON.stringify(txnPayload, null, 2)}</pre>
    ) || (
      <Typography variant="body1">
        {t('transaction.NoDecodedPayload')}
      </Typography>
    ); */
    return (
      <div>
        <br />
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h5' gutterBottom>
              {t('header.events')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              <div className={classes.table}>
                {isInitialLoad ? <Loading /> : eventsContent}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h5' gutterBottom>
              {t('transaction.RawData')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.rawData}>
              {isInitialLoad ? <Loading /> : rawContent}
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h5' gutterBottom>
              {t('transaction.decodedPayload')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.rawData}>
              {isInitialLoad ? (
                <Loading />
              ) : (
                <DecodedPayloadContent
                  network={network}
                  alt={t('transaction.NoDecodedPayload')}
                  txnPayload={txnPayload}
                />
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { transaction, match, t } = this.props;
    if (transaction === null) {
      return <Loading />;
    }
    if (transaction === '') {
      return <Error404 address={match.params.hash} />;
    }
    const network = match.params.network;
    const source = transaction;
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
    let moduleAddress;
    let moduleName;
    let functionName;
    /*
    let arg0;
    let arg1;
    let arg2;
    */
    /*
    if ('ScriptFunction' in txnPayload) {
      const func = txnPayload.ScriptFunction.func as {
        address: types.AccountAddress;
        module: types.Identifier;
        functionName: types.Identifier;
      };
      moduleAddress = func.address;
      moduleName = func.module;
      functionName = func.functionName;
      // const args = txnPayload.ScriptFunction.args;
      /*
      let de2;
      try {
        arg0 = args[0];
        arg1 = args[1];
        de2 = new bcs.BcsDeserializer(arrayify(args[2]));
        arg2 = de2.deserializeU128().toString();
      } catch (e) {
        console.log(e);
      }
    }
    */
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
        /*
        const func = txnPayload.Package.init_script.func;
        const { address, module, functionName } = func;
        functionId = `${address}::${module}::${functionName}`;
        */
      }
    }

    /*
    if ('ScriptFunction' in txnPayload) {
      args = txnPayload.ScriptFunction.args;
    }
    if ('Package' in txnPayload) {
      if (txnPayload.Package.init_script) {
        args = txnPayload.Package.init_script.args;
      }
    }
    */
    const provider = new providers.JsonRpcProvider(
      `https://${network}-seed.starcoin.org`,
    );
    const getResolvedFunction = async () => {
      const data = await provider.send('contract.resolve_function', [functionId]);
      this.setState({ resolvedFunction: data });
    };
    getResolvedFunction();

    const resolvedFunction = this.state?.resolvedFunction;

    const decodedArgs = args ? args.map((arg: string, index: number) => {
      const type_tag = resolvedFunction?.args[index + 1]?.type_tag;
      return resolvedFunction?.args[index + 1]
        ? [types.formatTypeTag(type_tag),
          type_tag !== 'Address' ? formatArgsWithTypeTag(
            new bcs.BcsDeserializer(arrayify(arg)),
            resolvedFunction.args[index + 1].type_tag,
          ) : arg,
        ]
        : arg;
    }) : {};
    // txnPayload.ScriptFunction.args = decodedArgs;
    if ('ScriptFunction' in txnPayload) {
      txnPayload.ScriptFunction.args = decodedArgs;
    }
    if ('Package' in txnPayload) {
      if (txnPayload.Package.init_script) {
        txnPayload.Package.init_script.args = decodedArgs;
      }
    }

    const columns = [
      [t('common.Hash'), source.transaction_hash],
      [t('transaction.Type'), type],
      [
        t('common.Time'),
        `${new Date(parseInt(source.timestamp, 10)).toLocaleString()} ${new Date().toTimeString().slice(9)}`,
      ],
      [
        t('transaction.BlockHash'),
        <CommonLink
          path={`/${network}/blocks/detail/${source.block_hash}`}
          title={source.block_hash}
        />,
      ],
      [
        t('transaction.BlockHeight'),
        <BaseRouteLink to={`/${network}/blocks/height/${source.block_number}`}>
          {formatNumber(source.block_number)}
        </BaseRouteLink>,
      ],
      // [t('common.Time'), new Date(parseInt(blockTime, 10)).toLocaleString()],
      [t('transaction.StateRootHash'), source.state_root_hash],
      [t('transaction.Status'), source.status],
      [t('common.GasUsed'), source.gas_used],
      [
        t('transaction.Sender'),
        <CommonLink path={`/${network}/address/${sender}`} title={sender} />,
      ],
    ];

    if (moduleAddress) {
      columns.push([t('transaction.FunctionModuleAddress'), moduleAddress]);
    }
    if (moduleName) {
      columns.push([t('transaction.FunctionModuleName'), moduleName]);
    }
    if (functionName) {
      columns.push([t('transaction.FunctionName'), functionName]);
    }
    if (txn_type_args) {
      columns.push([t('transaction.TxnTypeArgs'), JSON.stringify(txn_type_args[0] || [])]);
    }

    for (let i = 0; i < decodedArgs.length; i++) {
      if (decodedArgs[i][0] === 'address') {
        const address = decodedArgs[i][1];
        columns.push([
          `${t('transaction.arg')} ${i + 1}`,
          <CommonLink path={`/${network}/address/${address}`} title={address} />,
        ]);
      } else {
        columns.push([`${t('transaction.arg')} ${i + 1}`, decodedArgs[i][1]]);
      }
    }
    /*
    if (arg0) {
      columns.push([
        t('transaction.arg0'),
        <CommonLink path={`/${network}/address/${arg0}`} title={arg0} />,
      ]);
    }
    if (arg1) {
      columns.push([t('transaction.arg1'), arg1]);
    }
    if (arg2) {
      columns.push([t('transaction.arg2'), `${formatBalance(arg2)} STC`]);
    }
    */

    return (
      <PageView
        id={source.transaction_hash}
        title={t('transaction.title')}
        name={t('transaction.title')}
        pluralName={t('transaction.title')}
        searchRoute={`/${network}/transactions`}
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
