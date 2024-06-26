import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import get from 'lodash/get';
import { onchain_events } from '@starcoin/starcoin';
import { createStyles, withStyles } from '@mui/styles';
import formatNumber from '@/utils/formatNumber';
import { toObject, getNetwork } from '@/utils/helper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import ScanTabPanel, { a11yProps } from '@/common/TabPanel';
import CommonLink from '@/common/Link';
import PageView from '@/common/View/PageView';
import Loading from '@/common/Loading';
import TransactionTable from '@/Transactions/components/Table';
import PageViewTable from '@/common/View/PageViewTable';
import EventViewTable from '@/common/View/EventViewTable';
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
  tabSelect:number,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    block: null,
    blockTransactions: null,
    getBlock: () => {
    },
    getBlockByHeight: () => {
    },
    getBlockTransactions: () => {
    },
    getBlockTransactionsByHeight: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      epochData: undefined,
      hash: props.params.hash,
      height: props.params.height,
      tabSelect: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
    const tabList = ["title", "events", "uncles"];
    const tabIndex = tabList.indexOf(this.props.params.tab);
    if (tabIndex > -1) {
      this.setState({tabSelect:tabIndex});
    }
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    // switch hash only in current page, won't switch height
    // so only need to empty height while switch to /hash/xxx from height/xxx
    if (nextProps.params.hash !== prevState.hash) {
      return { ...prevState, hash: nextProps.params.hash, height: '' };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.params.hash !== this.state.hash && prevState.hash !== this.state.hash) {
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

  generateExtraTabs() {
    const { block, blockTransactions, classes, params, t } = this.props;
    const isInitialLoad = !block;
    const transactions = get(block, 'body.Full', []);
    transactions.map((tx: any) => {
      if (blockTransactions && blockTransactions.contents) {
        const block = blockTransactions.contents.filter((block: any) => block.transaction_hash === tx.transaction_hash);
        if (block.length) {
          tx.timestamp = block[0].timestamp;
        }
      }
      return tx;
    });
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

    const network = params.network;
    const uncles = get(block, 'uncles', []);
    const unclesTable: any[] = [];
    uncles.forEach((uncle: any) => {
      const columns: any[] = [];
      columns.push([t('common.Hash'), uncle.block_hash]);
      columns.push([t('block.Height'), formatNumber(uncle.number)]);
      columns.push([t('common.Time'), `${new Date(parseInt(uncle.timestamp, 10)).toLocaleString()} ${new Date().toTimeString().slice(9)}`]);
      columns.push([t('block.Author'),
        <CommonLink key={uncle.author} path={`/${network}/address/${uncle.author}`} title={uncle.author} />]);
      columns.push([t('block.Difficulty'), uncle.difficulty]);
      columns.push([t('common.GasUsed'), uncle.gas_used]);
      columns.push([t('block.ParentHash'),
        <CommonLink key={uncle.parent_hash} path={`/${network}/blocks/detail/${uncle.parent_hash}`}
                    title={uncle.parent_hash} />]);
      unclesTable.push(<PageViewTable key={uncle.number} columns={columns} />);
    });

    const transactionsContent = transactions.length ? <TransactionTable
      transactions={transactions}
    /> : <Typography variant='body1'>{t('transaction.NoTransactionData')}</Typography>;

    const eventsContent = events.length ? eventsTable :
      <Typography variant='body1'>{t('event.NoEventData')}</Typography>;
    const unclesContent = uncles.length ? unclesTable :
      <Typography variant='body1'>{t('uncle.NoUncleData')}</Typography>;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      this.setState({tabSelect:newValue});
      const { navigate } = this.props;
      const hash = this.state.hash;
      const height = this.state.height;
      const tabList = ["title", "events", "uncles"];
      const tabName = tabList[newValue];
      let path;
      if (height) {
        path = `/${getNetwork()}/blocks/height/${height}/${tabName}`;
      } else {
        path = `/${getNetwork()}/blocks/detail/${hash}/${tabName}`;
      }
      navigate(path);
    };

    return (<Card className={classes.card}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
          <Tabs value={this.state.tabSelect} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={t('transaction.title')} {...a11yProps(0)} />
            <Tab label= {t('header.events')} {...a11yProps(1)} />
            <Tab label= {t('block.Uncles')} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <ScanTabPanel value={this.state.tabSelect} index={0}>
          {isInitialLoad ? <Loading /> : transactionsContent}
        </ScanTabPanel>
        <ScanTabPanel value={this.state.tabSelect} index={1}>
          {isInitialLoad ? <Loading /> : eventsContent}
        </ScanTabPanel>
        <ScanTabPanel value={this.state.tabSelect} index={2}>
          {isInitialLoad ? <Loading /> : unclesContent}
        </ScanTabPanel>

      </Box>
    </Card>);
  }

  render() {
    const { block, blockTransactions, params, t } = this.props;
    const network = params.network;
    const isInitialLoad = !block || !blockTransactions;
    if (isInitialLoad) {
      return <Loading />;
    }
    if (!block.header) {
      return null;
    }
    const header = block.header;
    const columns = [
      [t('common.Hash'), header.block_hash],
      [t('block.Height'), formatNumber(header.number)],
      [t('common.Time'), `${new Date(parseInt(header.timestamp, 10)).toLocaleString()} ${new Date().toTimeString().slice(9)}`],
      [t('block.Author'),
        <CommonLink key={header.author} path={`/${network}/address/${header.author}`} title={header.author} />],
      [t('block.Difficulty'), formatNumber(header.difficulty_number)],
      [t('common.GasUsed'), formatNumber(header.gas_used)],
    ];

    if (network === 'vega' || network === 'halley') {
      if (header.parents_hash !== null && header.parents_hash !== undefined) {
        columns.push(
          [t('block.ParentsHash'),
            header.parents_hash.map((hash: string) => (
              <CommonLink key={hash} path={`/${network}/blocks/detail/${hash}`} title={hash} />
            ))
          ]
        );
      }

      if (block.daa_score !== null && block.daa_score !== undefined) {
        columns.push([t('block.DaaScore'),formatNumber(block.daa_score)]);
      }

      if (block.heightgroup_index !== null && block.heightgroup_index !== undefined) {
        columns.push([t('block.HeightgroupIndex'),formatNumber(block.heightgroup_index)]);
      }

      if (block.merged_blueset !== null && block.merged_blueset !== undefined) {
        columns.push(
          [t('block.MergedBlueset'),
            block.merged_blueset.map((hash: string) => (
              <CommonLink key={hash} path={`/${network}/blocks/detail/${hash}`} title={hash} />
            )),
          ],
        );
      }
    } else {
      columns.push(
        [t('block.ParentHash'),
          <CommonLink key={header.parent_hash} path={`/${network}/blocks/detail/${header.parent_hash}`}
                    title={header.parent_hash} />
        ]
      );
    }

    return (
      <PageView
        id={header.block_hash}
        title={t('block.title')}
        name={t('block.title')}
        pluralName={t('header.blocks')}
        searchRoute={`/${network}/blocks`}
        bodyColumns={columns}
        extra={this.generateExtraTabs()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
