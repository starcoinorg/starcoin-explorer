import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@mui/styles';
import { getNetwork } from '@/utils/helper';
import formatNumber from '@/utils/formatNumber';
import Card from '@mui/material/Card';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { getTokenPrecision } from '@/utils/sdk';
import BaseRouteLink from '@/common/BaseRouteLink';
import PageView from '@/common/View/PageView';
import Loading from '@/common/Loading';
import { withRouter,RoutedProps } from '@/utils/withRouter';

const useStyles = (theme: any) => createStyles({
  table: {
    width: '100%',
    display: 'block',
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  shrinkMaxCol: {
    flex: '1 100 auto',
    minWidth: 60,
  },
  card: {
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    flexDirection: 'column',
  },
  shrinkCol: {
    flex: '1 10 auto',
  },
  accordion: {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
});

interface IndexProps extends RoutedProps{
  classes: any;
  t: any;
  match: any;
  tokenInfo: any;
  getTokenInfo: (contents: any, callback?: any) => any;
}

interface IndexState {
  token_type_tag?: string,
  token_precision?: number,
}

class Index extends PureComponent<IndexProps, IndexState> {

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    tokenInfo: null,
    getTokenInfo: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      token_type_tag: props.params.token_type_tag,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    // switch hash only in current page, won't switch height
    // so only need to empty height while switch to /hash/xxx from height/xxx
    if (nextProps.params.token_type_tag !== prevState.token_type_tag) {
      return { ...prevState, token_type_tag: nextProps.params.token_type_tag, height: '' };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.params.token_type_tag !== this.state.token_type_tag && prevState.token_type_tag !== this.state.token_type_tag) {
      this.fetchData();
    }
  }

  fetchData() {
    const token_type_tag = this.state.token_type_tag;
    if (token_type_tag) {
      getTokenPrecision(token_type_tag).then(data => {
        if (data) {
          this.setState({ token_precision: parseInt(data[0] as string, 10) });
        } else {
          // this.setState({ accountResources: 'noResource' });
          console.log('get precision failed');
        }
      });

      this.props.getTokenInfo({ token_type_tag });
    }
  }

  /*
  generateExtra() {
    const { block, blockTransactions, classes, match, t } = this.props;
    const isInitialLoad = !block;
    const transactions = get(block, 'body.Full', []);
    transactions.map((tx: any) => {
      if (blockTransactions && blockTransactions.contents) {
        const block = blockTransactions.contents.filter((block: any) => block.transaction_hash === tx.transaction_hash)
        if (block.length) {
          tx.timestamp = block[0].timestamp
        }
      }
      return tx
    })
    const blockTransactionHits = get(blockTransactions, 'contents');
    const blockEventsIndex = blockTransactionHits.length - 1;
    const getBlockEventsString = `contents[${ blockEventsIndex.toString() }].events`;
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

    const network = params.network;
    const uncles = get(block, 'uncles', []);
    const unclesTable: any[] = [];
    uncles.forEach((uncle: any) => {
      const columns: any[] = [];
      columns.push([t('common.Hash'), uncle.block_hash]);
      columns.push([t('block.Height'), formatNumber(uncle.number)]);
      columns.push([t('common.Time'), new Date(parseInt(uncle.timestamp, 10)).toLocaleString()]);
      columns.push([t('block.Author'), <CommonLink key={uncle.author} path={`/${ network }/address/${ uncle.author }`} title={uncle.author} />]);
      columns.push([t('block.Difficulty'), uncle.difficulty]);
      columns.push([t('common.GasUsed'), uncle.gas_used]);
      columns.push([t('block.ParentHash'), <CommonLink key={uncle.parent_hash} path={`/${ network }/blocks/detail/${ uncle.parent_hash }`} title={uncle.parent_hash} />]);
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
  */
  generateExtra() {
    const { tokenInfo, t } = this.props;
    const token = tokenInfo ? tokenInfo.contents : null;
    const holdersListURL = `/${getNetwork()}/tokens/holders/${token[0].type_tag}/1`;
    const transactionsListURL = `/${getNetwork()}/tokens/transactions/${token[0].type_tag}/1`;
    return (
      <div>
        <br />
        <Card className={this.props.classes.accordion}>
          <AccordionSummary
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <BaseRouteLink to={holdersListURL}>
              <Typography variant='h5' gutterBottom>{t('token.holderList')}</Typography>
            </BaseRouteLink>
          </AccordionSummary>
        </Card>
        <br />
        <Card className={this.props.classes.accordion}>
          <AccordionSummary
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <BaseRouteLink to={transactionsListURL}>
              <Typography variant='h5' gutterBottom>{t('token.transactionList')}</Typography>
            </BaseRouteLink>
          </AccordionSummary>
        </Card>
        <br />
      </div>
    );
  }

  render() {
    // const { token, match, t } = this.props;
    const { tokenInfo, t } = this.props;
    const token = tokenInfo ? tokenInfo.contents : null;
    // const network = params.network;
    const isInitialLoad = !tokenInfo;
    if (isInitialLoad) {
      return <Loading />;
    }
    if (!tokenInfo) {
      return null;
    }
    /*
  const columns = [
    [t('common.Hash'), token.type_tag],
    [t('block.Height'), formatNumber(header.number)],
    [t('common.Time'), new Date(parseInt(header.timestamp, 10)).toLocaleString()],
    [t('block.Author'), <CommonLink key={header.author} path={`/${ network }/address/${ header.author }`} title={header.author} />],
    [t('block.Difficulty'), formatNumber(header.difficulty_number)],
    [t('common.GasUsed'), formatNumber(header.gas_used)],
    [t('block.ParentHash'), <CommonLink key={header.parent_hash} path={`/${ network }/blocks/detail/${ header.parent_hash }`} title={header.parent_hash} />],
  ];
    */

    // const precision = this.state.token_precision ? this.state.token_precision : 1;
    const columns = [
      [t('token.address'), token[0].type_tag],
      // [t('token.totalsupply'), formatNumber(token[0].market_cap / precision)],
      [t('token.circulatingsupply'), formatNumber(token[0].market_cap)],
      [t('token.holdercount'), formatNumber(token[0].addressHolder)],
      // [t('token.position'), formatNumber(token[0].volume / precision)]
      [t('token.volume'), formatNumber(token[0].volume)],
    ];
    return (
      <PageView
        id={token[0].type_tag}
        title={t('token.title')}
        name={t('token.title')}
        pluralName={t('header.tokens')}
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
