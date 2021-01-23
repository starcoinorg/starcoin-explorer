import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
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

interface IndexProps {
  classes: any;
  hash: any;
  match: any;
  computedMatch: any;
  block: any;
  getBlock: (data: any, callback?: any) => any;
}

const useStyles = () => ({
  table: {
    minWidth: 700,
  },
});

class Index extends PureComponent<IndexProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    hash: '',
    match: {},
    computedMatch: {},
    block: null,
    getBlock: () => {}
  };

  componentDidMount() {
    console.log('detail');
    console.log('props', this.props);
    const hash = this.props.match.params.hash;
    console.log('hash', hash);
    this.props.getBlock({ hash });
  }

  generateExtra() {
    const { block } = this.props;
    const isInitialLoad = !block;
    const transactions = block.hits.hits[0]._source.body.Full || [];
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
            {isInitialLoad ? <Loading /> : <TransactionTable
              transactions={transactions}
            />}
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
            TODO
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { block } = this.props;
    if (!block) {
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
