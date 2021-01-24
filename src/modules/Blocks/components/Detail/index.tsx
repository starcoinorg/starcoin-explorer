import React, { PureComponent } from 'react';
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
// import { getEpochData } from '@/utils/sdk';

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

interface IndexState {
  epochData: any,
}

class Index extends PureComponent<IndexProps, IndexState> {
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

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      epochData: undefined,
    };
  }

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getBlock({ hash });
    this.props.getBlockTransactions({ hash });
  }

  generateExtra() {
    const { block, blockTransactions, classes } = this.props;
    const isInitialLoad = !block;
    const transactions = block.hits.hits[0]._source.body.Full || [];
    const events = blockTransactions.hits.hits[0]._source.events || [];
    const eventsTable: any[] = [];
    events.forEach((event: any) => {
      const columns: any[] = [];
      columns.push(['Data', event.data]);
      columns.push(['Key', event.event_key]);
      columns.push(['Seq', formatNumber(event.event_seq_number)]);
      eventsTable.push(<PageViewTable columns={columns} />);
    });

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
            <div className={classes.table}>
              {isInitialLoad ? <Loading /> : transactions.length ? <TransactionTable
                transactions={transactions}
              /> : <Typography variant="body1">No Transaction Data</Typography>}
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
            <Typography variant="h5" gutterBottom>Events</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              {isInitialLoad ? <Loading /> : events.length ? eventsTable : <Typography variant="body1">No Event Data</Typography>}
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
    // if (!this.state.epochData) {
    //   getEpochData(header.author).then(data => {
    //     console.log('epochData', data);
    //     this.setState({ epochData: data });
    //   });
    // }
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
