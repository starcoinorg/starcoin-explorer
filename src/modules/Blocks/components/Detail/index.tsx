import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import TransactionTable from '@/Transactions/components/Table';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import CommonTime from '@/common/Time';
import formatNumber from '@/utils/formatNumber';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PageViewTable from '@/common/View/PageViewTable';

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
  getBlockTransactions: (data: any, callback?: any) => any;
}

interface IndexState {
  epochData: any,
  hash: string,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    block: null,
    blockTransactions: null,
    getBlock: () => {},
    getBlockTransactions: () => {}
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      epochData: undefined,
      hash: props.match.params.hash
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.match.params.hash !== prevState.hash) {
      return { ...prevState, hash: nextProps.match.params.hash };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.match.params.hash !== this.state.hash && prevState.state !== this.state.hash) {
      this.fetchData();
    }
  }

  fetchData() {
    const hash = this.state.hash;
    this.props.getBlock({ hash });
    this.props.getBlockTransactions({ hash });
  }

  generateExtra() {
    const { block, blockTransactions, classes, t } = this.props;
    const isInitialLoad = !block;
    const transactions = block.hits.hits[0]._source.body.Full || [];
    const events = blockTransactions.hits.hits[0]._source.events || [];
    const eventsTable: any[] = [];
    events.forEach((event: any) => {
      const columns: any[] = [];
      columns.push([t('event.Data'), event.data]);
      columns.push([t('event.Key'), event.event_key]);
      columns.push([t('event.Seq'), formatNumber(event.event_seq_number)]);
      eventsTable.push(<PageViewTable key={event.event_key} columns={columns} />);
    });

    const transactionsContent = transactions.length ? <TransactionTable
      transactions={transactions}
    /> : <Typography variant="body1">{t('transaction.NoTransactionData')}</Typography>;

    const eventsContent = events.length ? eventsTable : <Typography variant="body1">{t('event.NoEventData')}</Typography>;
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
      </div>
    );
  }

  render() {
    const { block, blockTransactions, t } = this.props;
    if (!block || !blockTransactions) {
      return null;
    }
    const header = block.hits.hits[0]._source.header;

    const columns = [
      [t('common.Hash'), header.block_hash],
      [t('block.Height'), formatNumber(header.number)],
      [t('common.Time'), <CommonTime time={block.time} />],
      [t('block.Author'), <CommonLink key={header.author} path={`/address/${header.author}`} title={header.author} />],
      [t('block.Difficulty'), header.difficulty],
      [t('common.GasUsed'), header.gas_used],
      [t('block.ParentHash'), <CommonLink key={header.parent_hash} path={`/blocks/detail/${header.parent_hash}`} title={header.parent_hash} />],
    ];

    return (
      <PageView
        id={header.block_hash}
        title={t('block.title')}
        name={t('block.title')}
        pluralName={t('header.blocks')}
        searchRoute="/blocks"
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
