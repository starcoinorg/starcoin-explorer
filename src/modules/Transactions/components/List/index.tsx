import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
// import withLoading from '@/common/LoadingMasker/withLoading';
import BaseRouteLink from '@/common/BaseRouteLink';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import StyledTableRow from '@/common/Table/StyledTableRow';
import StyledTableCell from '@/common/Table/StyledTableCell';

interface IndexProps {
  classes: any;
  transactionList: any;
  getTransactionList: (data: any, callback?: any) => any;
}

interface IndexState {
  currentPage: number
}

const useStyles = () => ({
  table: {
    minWidth: 700,
  },
});

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    transactionList: null,
    getTransactionList: () => {}
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.currentPage);
  }

  fetchListPage = (page: number) => {
    console.log('fetchListPage', page);
    this.props.getTransactionList({ page });
  };

  pagination = (type: string) => {
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getTransactionList({ page }, () => { this.setState({ currentPage: page }); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getTransactionList({ page }, () => { this.setState({ currentPage: page }); });
    }
  };

  render() {
    const { transactionList } = this.props;
    if (!transactionList) {
      return null;
    }
    const { classes } = this.props;
    const hits = transactionList.hits.hits;
    const size = 20;
    const from = (this.state.currentPage - 1) * size + 1;
    const to = this.state.currentPage * size;
    return (
      <>
        <div>
          Transactions List
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableBody>
                {
                  hits.map((row: any) => {
                    const transaction_hash = row._source.transaction_hash;
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
          <p>
            {from} - {to}
            <IconButton aria-label="prev" onClick={() => this.pagination('prev')} disabled={this.state.currentPage === 1}>
              <ArrowBackIos />
            </IconButton>
            <IconButton aria-label="next" onClick={() => this.pagination('next')}>
              <ArrowForwardIos />
            </IconButton>
          </p>
        </div>
      </>
    );
  }
}

export default withStyles(useStyles)(Index);
