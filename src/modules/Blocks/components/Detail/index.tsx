import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import get from 'lodash/get';
import { onchain_events } from '@starcoin/starcoin';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import TransactionTable from '@/Transactions/components/Table';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import formatNumber from '@/utils/formatNumber';
import { toObject } from '@/utils/helper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PageViewTable from '@/common/View/PageViewTable';
import EventViewTable from '@/common/View/EventViewTable';

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
});

interface IndexProps {
  classes: any;
  t: any;
  match: any;
  block: any;
  blockTransactions: any;
  getBlock: (data: any, callback?: any) => any;
  getBlockByHeight: (data: any, callback?: any) => any;
  getBlockTransactions: (data: any, callback?: any) => any;
  getBlockTransactionsByHeight: (data: any, callback?: any) => any;
}

interface IndexState {
  epochData: any,
  hash?: string,
  height?: string,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    block: null,
    blockTransactions: null,
    getBlock: () => { },
    getBlockByHeight: () => { },
    getBlockTransactions: () => { },
    getBlockTransactionsByHeight: () => { }
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      epochData: undefined,
      hash: props.match.params.hash,
      height: props.match.params.height
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    // switch hash only in current page, won't switch height
    // so only need to empty height while switch to /hash/xxx from height/xxx
    if (nextProps.match.params.hash !== prevState.hash) {
      return { ...prevState, hash: nextProps.match.params.hash, height: '' };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.match.params.hash !== this.state.hash && prevState.hash !== this.state.hash) {
      this.fetchData();
    }
  }

  fetchData() {
    const hash = this.state.hash;
    const height = this.state.height;
    if (hash) {
      this.props.getBlock({ hash });
      this.props.getBlockTransactions({ hash });
    }
    if (height) {
      this.props.getBlockByHeight({ height });
      this.props.getBlockTransactionsByHeight({ height });
    }
  }

  generateExtra() {
    const { block, blockTransactions, classes, match, t } = this.props;
    const isInitialLoad = !block;
    const transactions = get(block, 'body.Full', []);
    const blockTransactionHits = get(blockTransactions, 'contents');
    const blockEventsIndex = blockTransactionHits.length - 1;
    const getBlockEventsString = `contents[${blockEventsIndex.toString()}].events`;
    const events = get(blockTransactions, getBlockEventsString, []);
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

    const network = match.params.network;
    const uncles = get(block, 'uncles', []);
    const unclesTable: any[] = [];
    uncles.forEach((uncle: any) => {
      const columns: any[] = [];
      columns.push([t('common.Hash'), uncle.block_hash]);
      columns.push([t('block.Height'), formatNumber(uncle.number)]);
      columns.push([t('common.Time'), new Date(parseInt(uncle.timestamp, 10)).toLocaleString()]);
      columns.push([t('block.Author'), <CommonLink key={uncle.author} path={`/${network}/address/${uncle.author}`} title={uncle.author} />]);
      columns.push([t('block.Difficulty'), uncle.difficulty]);
      columns.push([t('common.GasUsed'), uncle.gas_used]);
      columns.push([t('block.ParentHash'), <CommonLink key={uncle.parent_hash} path={`/${network}/blocks/detail/${uncle.parent_hash}`} title={uncle.parent_hash} />]);
      unclesTable.push(<PageViewTable key={uncle.number} columns={columns} />);
    });

    const transactionsContent = transactions.length ? <TransactionTable
      transactions={transactions}
    /> : <Typography variant="body1">{t('transaction.NoTransactionData')}</Typography>;

    const eventsContent = events.length ? eventsTable : <Typography variant="body1">{t('event.NoEventData')}</Typography>;
    const unclesContent = uncles.length ? unclesTable : <Typography variant="body1">{t('uncle.NoUncleData')}</Typography>;
    return (
      <div>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('transaction.title')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              {isInitialLoad ? <Loading /> : transactionsContent}
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
            <Typography variant="h5" gutterBottom>{t('header.events')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              {isInitialLoad ? <Loading /> : eventsContent}
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
            <Typography variant="h5" gutterBottom>{t('block.Uncles')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              {isInitialLoad ? <Loading /> : unclesContent}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { block, blockTransactions, match, t } = this.props;
    const network = match.params.network;
    const isInitialLoad = !block || !blockTransactions;
    if (isInitialLoad) {
      return <Loading />;
    }
    if (!block.length) {
      return null;
    }
    const header = block.header;
    const columns = [
      [t('common.Hash'), header.block_hash],
      [t('block.Height'), formatNumber(header.number)],
      [t('common.Time'), new Date(parseInt(header.timestamp, 10)).toLocaleString()],
      [t('block.Author'), <CommonLink key={header.author} path={`/${network}/address/${header.author}`} title={header.author} />],
      [t('block.Difficulty'), header.difficulty],
      [t('common.GasUsed'), header.gas_used],
      [t('block.ParentHash'), <CommonLink key={header.parent_hash} path={`/${network}/blocks/detail/${header.parent_hash}`} title={header.parent_hash} />],
    ];

    return (
      <PageView
        id={header.block_hash}
        title={t('block.title')}
        name={t('block.title')}
        pluralName={t('header.blocks')}
        searchRoute={`/${network}/blocks`}
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
