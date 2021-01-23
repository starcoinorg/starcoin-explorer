import React, { PureComponent } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import CommonTime from '@/common/Time';
import formatNumber from '@/utils/formatNumber';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BaseRouteLink from '@/common/BaseRouteLink';

interface IndexProps {
  classes: any;
  hash: any;
  match: any;
  computedMatch: any;
  block: any;
  getBlock: (data: any, callback?: any) => any;
}

const StyledTableCell = withStyles((theme: Theme) => createStyles({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme: Theme) => createStyles({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
    const transactions = block.hits.hits[0]._source.body.Full;
    console.log('transactions', transactions);
    let transactionsDetail;
    if (transactions && transactions.length) {
      transactionsDetail = (
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableBody>
              {
                transactions.map((row: any) => {
                  const transaction_hash = row.transaction_hash;
                  const transactionUrl = `/transactions/detail/${transaction_hash}`;
                  return (
                    <StyledTableRow key={transaction_hash}>
                      <StyledTableCell component="th" scope="row">
                        <BaseRouteLink to={transactionUrl}>{transaction_hash}</BaseRouteLink>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      transactionsDetail = <Typography variant="body1">No Transaction Data</Typography>;
    }
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
            {transactionsDetail}
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
