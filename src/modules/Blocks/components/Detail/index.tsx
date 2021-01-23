import React, { PureComponent } from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Table from '@/common/Table';
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
  hash: any;
  match: any;
  computedMatch: any;
  block: any;
  blockTransactions: any;
  getBlock: (data: any, callback?: any) => any;
  getBlockTransactions: (data: any, callback?: any) => any;
}

class Index extends PureComponent<IndexProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    hash: '',
    match: {},
    computedMatch: {},
    block: null,
    blockTransactions: null,
    getBlock: () => {},
    getBlockTransactions: () => {}
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getBlock({ hash });
    this.props.getBlockTransactions({ hash });
  }

  generateExtra() {
    const { block, blockTransactions, classes } = this.props;
    console.log('blockTransactions', blockTransactions);
    const isInitialLoad = !block;
    const transactions = block.hits.hits[0]._source.body.Full || [];

    const events = blockTransactions.hits.hits[0]._source.events || [];
    const eventValues: any[] = [];
    const keyValues: any[] = [];
    const seqNumberValues: any[] = [];
    events.forEach((event: any) => {
      eventValues.push(event.data);
      keyValues.push(event.event_key);
      seqNumberValues.push(formatNumber(event.event_seq_number));
    });
    const columns = [
      {
        name: 'Event',
        values: eventValues,
        className: classes.shrinkMaxCol,
      },
      {
        name: 'Key',
        values: keyValues,
        className: classes.shrinkCol,

      },
      {
        name: 'SeqNumber',
        values: seqNumberValues,
        minWidth: true,
      },
    ];
    return (
      <div>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Transaction</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isInitialLoad ? <Loading /> : transactions.length ? <TransactionTable
              transactions={transactions}
            /> : <Typography variant="body1">No Transaction Data</Typography>}
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Events</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              <Table columns={columns} />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { block, blockTransactions } = this.props;
    if (!block || !blockTransactions) {
      return null;
    }
    const header = block.hits.hits[0]._source.header;
    // const transactions = block.hits.hits[0]._source.body.Full;
    const columns = [
      ['Hash', header.block_hash],
      ['Height', formatNumber(header.number)],
      ['Time', <CommonTime time={block.time} />],
      ['Author', <CommonLink key={header.author} path={`/address/${header.author}`} title={header.author} />],
      ['Difficulty', header.difficulty],
      ['Gas Used', header.gas_used],
      ['Parant Hash', <CommonLink key={header.parent_hash} path={`/blocks/detail/${header.parent_hash}`} title={header.parent_hash} />],
    ];

    return (
      <PageView
        id={header.block_hash}
        title="Block"
        name="Block"
        pluralName="Blocks"
        searchRoute="/blocks"
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(Index);
