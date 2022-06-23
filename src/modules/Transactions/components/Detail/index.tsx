import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import formatNumber from '@/utils/formatNumber';
import Error404 from 'modules/Error404/index';
import { withStyles, createStyles } from '@mui/styles';
import {
  providers,
  onchain_events,
  encoding,
  types,
  bcs,
  serde,
} from '@starcoin/starcoin';
import { arrayify } from '@ethersproject/bytes';
import get from 'lodash/get';
import { toObject, getNetwork } from '@/utils/helper';
import useSWR from 'swr';
import FileSaver from 'file-saver';
import { GetApp } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import Card from '@mui/material/Card';
import { getNodeInfo } from '@/utils/sdk';
import ScanTabPanel, { a11yProps } from '@/common/TabPanel';
import BaseRouteLink from '@/common/BaseRouteLink';
import Loading from '@/common/Loading';
import EventViewTable from '@/common/View/EventViewTable';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import { withRouter,RoutedProps } from '@/utils/withRouter';





function formatArgsWithTypeTag(
  deserializer: serde.Deserializer,
  typeTag: types.TypeTag,
): string | undefined {
  try {
    if (typeof typeTag === 'string') {
      switch (typeTag) {
        case 'Signer':
        case 'Address': {
          let decodeAddress:string='0x';
          for(let i=0;i<16;i++){
            decodeAddress+=deserializer.deserializeU8().toString(16);
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
      fontSize:theme.spacing(1)
    },

    accordion: {
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
      color: theme.palette.getContrastText(theme.palette.background.paper),
    },
    csvExport: {
      textAlign: 'end',
    },
    csvExportIcon: {
      verticalAlign: 'middle',
    },
    card:{
      marginTop:theme.spacing(2),
      display: 'flex',
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
      color: theme.palette.getContrastText(theme.palette.background.paper),
      flexDirection: 'column',
    },
  });

interface IndexState {
  resolvedFunction: any;
  tabSelect:number,
  headNumber: number
}

interface IndexProps extends  RoutedProps {
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

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      resolvedFunction:undefined,
      tabSelect:0,
      headNumber:0,
    };
  }


  componentDidMount() {
    const tabList = ["events", "RawData", "decodedPayload"];
    const tabIndex = tabList.indexOf(this.props.params.tab);
    if (tabIndex > -1) {
      this.setState({tabSelect:tabIndex});
    }
    const hash = this.props.params.hash;
    this.props.getTransaction({ hash });

    getNodeInfo().then((info)=>{
      if (info){
        const headNumber = parseInt(info.peer_info.chain_info.head.number,10);
        this.setState({ resolvedFunction: undefined, tabSelect: 0, headNumber})
      }
    })

  }

  generateExtraTabs() {
    const { transaction, classes, t, params } = this.props;
    const network = params.network;
    const isInitialLoad = !transaction;
    const events = get(transaction, 'events', []);
    const eventsTable: any[] = [];

    for (let i = 0; i < events.length; i++) {
      const columns: any[] = [];
      const event = events[i];

      let type_tag = event.type_tag;
      type_tag = type_tag.replace(/<[^<]*?>/g, (str: string) => str.replace(/::/g, '-'));
      const eventTypeArray = (type_tag.split('::')).map((v: string) => v.replace(/-/g, '::'));
      const eventModule = eventTypeArray[1];
      const eventName = eventTypeArray[2];

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
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      this.setState({tabSelect:newValue});
      const { navigate } = this.props;
      const tabList = ["events", "RawData", "decodedPayload"];
      const hash = this.props.params.hash;
      const tabName = tabList[newValue];
      const path = `/${getNetwork()}/transactions/detail/${hash}/${tabName}`;
      navigate(path);
    };

    return (<Card className={classes.card}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
            <Tabs value={this.state.tabSelect} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={t('header.events')} {...a11yProps(0)} />
              <Tab label= {t('transaction.RawData')} {...a11yProps(1)} />
              <Tab label= {t('transaction.decodedPayload')} {...a11yProps(2)} />
            </Tabs>
          </Box>
          <ScanTabPanel value={this.state.tabSelect} index={0}>
            {isInitialLoad ? <Loading /> : eventsContent}
          </ScanTabPanel>
          <ScanTabPanel value={this.state.tabSelect} index={1}>
            <div className={classes.rawData}>
            {isInitialLoad ? <Loading /> : rawContent}
            </div>
          </ScanTabPanel>
          <ScanTabPanel value={this.state.tabSelect} index={2}>
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
          </ScanTabPanel>

        </Box>
      </Card>);
  }

  render() {
    const { transaction, params, t } = this.props;
    if (transaction === null) {
      return <Loading />;
    }
    if (transaction === '') {
      return <Error404 />;
    }
    const network = params.network;
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
    let moduleAddress: any;
    let moduleName: any;
    let functionName: any;
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
    const resolvedFunction = this.state?.resolvedFunction;
    if (!resolvedFunction){
      getResolvedFunction();
    }


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
      [t('transaction.Confirmations'), this.state.headNumber - source.block_number],
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

    const csvExport = () => {

      const savData = [
        [t('common.Hash'), source.transaction_hash],
        [t('transaction.Type'), type],
        [t('common.Time'),`${new Date(parseInt(source.timestamp, 10)).toLocaleString()} ${new Date().toTimeString().slice(9)}`],
        [t('transaction.BlockHash'),source.block_hash],
        [t('transaction.BlockHeight'),source.block_number],
        [t('transaction.StateRootHash'), source.state_root_hash],
        [t('transaction.Status'), source.status],
        [t('common.GasUsed'), source.gas_used],
        [t('transaction.Sender'), sender],
      ];

      if (moduleAddress) {
        savData.push([t('transaction.FunctionModuleAddress'), moduleAddress]);
      }
      if (moduleName) {
        savData.push([t('transaction.FunctionModuleName'), moduleName]);
      }
      if (functionName) {
        savData.push([t('transaction.FunctionName'), functionName]);
      }
      if (txn_type_args) {
        savData.push([t('transaction.TxnTypeArgs'), JSON.stringify(txn_type_args[0] || [])]);
      }
      
      for (let i = 0; i < decodedArgs.length; i++) {
        if (decodedArgs[i][0] === 'address') {
          const address = decodedArgs[i][1];
          savData.push([`${t('transaction.arg')} ${i+1}`,address]);
        } else {
          savData.push([`${t('transaction.arg')} ${i+1}`, decodedArgs[i][1]]);
        }
      }

      let csvData = "";
      let csvTitle = "";
      let csvRow = ""
      for (let index = 0; index < savData.length; index++) {
        const element = savData[index];
        csvTitle += `"${element[0]}",`;
        csvRow += `"${element[1]}",`;
      }
      csvData = `${csvTitle}\r\n${csvRow}`;
      const blob = new Blob([csvData], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `${source.transaction_hash}.csv`);

    }

    columns.push([
      ``,
      <div className={this.props.classes.csvExport}>
        [<Button onClick={()=>{csvExport()}}>
            Download CSV Export
          </Button>
        <GetApp className={this.props.classes.csvExportIcon} />]
      </div>
    ]);
      


    return (
      <PageView
        id={source.transaction_hash}
        title={t('transaction.title')}
        name={t('transaction.title')}
        pluralName={t('transaction.title')}
        searchRoute={`/${network}/transactions`}
        bodyColumns={columns}
        extra={this.generateExtraTabs()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)) );
