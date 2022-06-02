import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import formatNumber from '@/utils/formatNumber';
import { withStyles, createStyles } from '@mui/styles';
import { encoding, types, bcs } from '@starcoin/starcoin';
import { arrayify } from '@ethersproject/bytes';
import { formatBalance } from '@/utils/helper';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import ScanTabPanel, { a11yProps } from '@/common/TabPanel';
import Loading from '@/common/Loading';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import { withRouter,RoutedProps } from '@/utils/withRouter';



const useStyles = (theme: any) => createStyles({
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
  card:{
    marginTop:theme.spacing(2),
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    flexDirection: 'column',
  },
});

interface IndexProps extends RoutedProps{
  classes: any;
  t: any;
  match: any;
  // transaction: any;
  // getTransaction: (data: any, callback?: any) => any;
  pendingTransaction: any;
  getPendingTransaction: (data: any, callback?: any) => any;
}

interface IndexState {
  tabSelect:number,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    // transaction: null,
    // getTransaction: () => { }
    pendignTransaction: null,
    getPendingTransaction: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      tabSelect:0,
    };
  }

  componentDidMount() {
    const hash = this.props.params.hash;
    this.props.getPendingTransaction({ hash });
  }

  generateExtraTabs() {
    const { pendingTransaction, classes, t } = this.props;
    const isInitialLoad = !pendingTransaction;

    const source = pendingTransaction;
    let payloadInHex = '';
    if (source && source.raw_txn) {
      payloadInHex = source.raw_txn.payload;
    }
    const txnPayload = payloadInHex ? encoding.decodeTransactionPayload(payloadInHex) : [];

    // const eventsContent = events.length ? eventsTable : <Typography variant="body1">{t('event.NoEventData')}</Typography>;
    const rawContent = <pre>{JSON.stringify(pendingTransaction, null, 2)}</pre> ||
      <Typography variant='body1'>{t('transaction.NoRawData')}</Typography>;
    const decodedPayloadContent = <pre>{JSON.stringify(txnPayload, null, 2)}</pre> ||
      <Typography variant='body1'>{t('transaction.NoDecodedPayload')}</Typography>;
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      this.setState({tabSelect:newValue});
    };

    return (<Card className={classes.card}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
          <Tabs  value={this.state.tabSelect} onChange={handleChange} aria-label="basic tabs example">
            <Tab label= {t('transaction.RawData')} {...a11yProps(0)} />
            <Tab label= {t('transaction.decodedPayload')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <ScanTabPanel value={this.state.tabSelect} index={0}>
          <div className={classes.rawData}>
            {isInitialLoad ? <Loading /> : rawContent}
          </div>
        </ScanTabPanel>
        <ScanTabPanel value={this.state.tabSelect} index={1}>
          <div className={classes.rawData}>
            <div className={classes.rawData}>
              {isInitialLoad ? <Loading /> : decodedPayloadContent}
            </div>
          </div>
        </ScanTabPanel>

      </Box>
    </Card>);
  }

  render() {
    const { pendingTransaction, params, t } = this.props;
    if (!pendingTransaction) {
      return <Loading />;
    }
    const network = params.network;
    const source = pendingTransaction;
    let payloadInHex = '';
    let sender = '';
    if (source && source.raw_txn) {
      payloadInHex = source.raw_txn.payload;
      sender = source.raw_txn.sender;
    }
    const txnPayload = payloadInHex ? encoding.decodeTransactionPayload(payloadInHex) : [];
    const type = Object.keys(txnPayload)[0];

    let functionName;
    let moduleName;
    let arg0;
    let arg1;
    let arg2;
    if ('ScriptFunction' in txnPayload) {
      const func = txnPayload.ScriptFunction.func as { address: types.AccountAddress, module: types.Identifier, functionName: types.Identifier };
      functionName = func.functionName;
      moduleName = func.module;
      const args = txnPayload.ScriptFunction.args;
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

    const columns = [
      [t('common.Hash'), source.transaction_hash],
      [t('transaction.Type'), type],
      // [t('transaction.BlockHash'), <CommonLink path={`/${network}/blocks/detail/${source.block_hash}`} title={source.block_hash} />],
      // [t('transaction.BlockHeight'), <BaseRouteLink to={`/${network}/blocks/height/${source.block_number}`}>{formatNumber(source.block_number)}</BaseRouteLink>],

      [t('common.Time'), `${new Date(parseInt(source.timestamp, 10)).toLocaleString()} ${new Date().toTimeString().slice(9)}`],
      [t('common.ExpireTime'), `${new Date(parseInt(source.raw_txn.expiration_timestamp_secs, 10) * 1000).toLocaleString()} ${new Date().toTimeString().slice(9)}`],
      // [t('transaction.StateRootHash'), source.state_root_hash],
      // [t('transaction.Status'), source.status],
      // [t('common.GasUsed'), source.gas_used],
      [t('common.MaxGasAmount'), formatNumber(source.raw_txn.max_gas_amount)],
      [t('transaction.Sender'), <CommonLink path={`/${network}/address/${sender}`} title={sender} />],
    ];

    if (moduleName) {
      columns.push([t('transaction.FunctionModuleName'), moduleName]);
    }
    if (functionName) {
      columns.push([t('transaction.FunctionName'), functionName]);
    }
    if (arg0) {
      columns.push([t('transaction.arg0'), <CommonLink path={`/${network}/address/${arg0}`} title={arg0} />]);
    }
    if (arg1) {
      columns.push([t('transaction.arg1'), arg1]);
    }
    if (arg2) {
      columns.push([t('transaction.arg2'), `${formatBalance(arg2)} STC`]);
    }

    return (
      <PageView
        id={source.transaction_hash}
        title={t('pending_transaction.title')}
        name={t('pending_transaction.title')}
        pluralName={t('pending_transaction.title')}
        bodyColumns={columns}
        extra={this.generateExtraTabs()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
