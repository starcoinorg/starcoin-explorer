import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import formatNumber from '@/utils/formatNumber';
import CommonLink from '@/common/Link';
import PageView from '@/common/View/PageView';
import EventViewTable from '@/common/View/EventViewTable';
import Loading from '@/common/Loading';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { onchain_events, encoding, types, bcs } from '@starcoin/starcoin';
import { arrayify } from '@ethersproject/bytes';
import get from 'lodash/get';
import { formatBalance, toObject } from '@/utils/helper';
import BaseRouteLink from '@/common/BaseRouteLink';

const useStyles = () => createStyles({
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
  }
});

interface IndexProps {
  classes: any;
  t: any;
  match: any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
}

class Index extends PureComponent<IndexProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    transaction: null,
    getTransaction: () => { }
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getTransaction({ hash });
  }

  generateExtra() {
    const { transaction, classes, t } = this.props;
    const isInitialLoad = !transaction;
    const events = get(transaction, 'events', []);
    const eventsTable: any[] = [];

    for (let i = 0; i < events.length; i++) {
      const columns: any[] = [];
      const event = events[i];
      const eventTypeArray = event.type_tag.split('::');
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
        console.log(e);
        eventDataDetail = event.data;
      }

      try {
        const eventKeyInHex = event.event_key;
        const de = onchain_events.decodeEventKey(eventKeyInHex);
        eventKeyDetail = toObject(de);
      } catch (e) {
        console.log(e);
        eventKeyDetail = event.event_key;
      }
      columns.push([t('event.Data'), eventDataDetail]);
      columns.push([t('event.Module'), eventModule]);
      columns.push([t('event.Name'), eventName]);
      columns.push([t('event.Key'), eventKeyDetail]);
      columns.push([t('event.Seq'), formatNumber(event.event_seq_number)]);
      eventsTable.push(<EventViewTable key={event.event_key} columns={columns} />);
    }

    const source = transaction;
    let payloadInHex = '';
    if (source.user_transaction && source.user_transaction.raw_txn) {
      payloadInHex = source.user_transaction.raw_txn.payload;
    }
    const txnPayload = payloadInHex ? encoding.decodeTransactionPayload(payloadInHex) : [];

    const eventsContent = events.length ? eventsTable : <Typography variant="body1">{t('event.NoEventData')}</Typography>;
    const rawContent = <pre>{JSON.stringify(transaction, null, 2)}</pre> || <Typography variant="body1">{t('transaction.NoRawData')}</Typography>;
    const decodedPayloadContent = <pre>{JSON.stringify(txnPayload, null, 2)}</pre> || <Typography variant="body1">{t('transaction.NoDecodedPayload')}</Typography>;
    return (
      <div>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('header.events')}</Typography>
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
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('transaction.RawData')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.rawData}>
              {isInitialLoad ? <Loading /> : rawContent}
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('transaction.decodedPayload')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.rawData}>
              {isInitialLoad ? <Loading /> : decodedPayloadContent}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { transaction, match, t } = this.props;
    if (!transaction) {
      return <Loading />;
    }
    const network = match.params.network;
    const source = transaction;
    let payloadInHex = '';
    let sender = '';
    if (source.user_transaction && source.user_transaction.raw_txn) {
      payloadInHex = source.user_transaction.raw_txn.payload;
      sender = source.user_transaction.raw_txn.sender;
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
      [t('transaction.BlockHash'), <CommonLink path={`/${network}/blocks/detail/${source.block_hash}`} title={source.block_hash} />],
      [t('transaction.BlockHeight'), <BaseRouteLink to={`/${network}/blocks/height/${source.block_number}`}>{formatNumber(source.block_number)}</BaseRouteLink>],
      // [t('common.Time'), new Date(parseInt(blockTime, 10)).toLocaleString()],
      [t('transaction.StateRootHash'), source.state_root_hash],
      [t('transaction.Status'), source.status],
      [t('common.GasUsed'), source.gas_used],
      [t('transaction.Sender'), <CommonLink path={`/${network}/address/${sender}`} title={sender} />]
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
