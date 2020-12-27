import React, { PureComponent } from 'react';
import BaseRouteLink from "@/common/BaseRouteLink";
// import withLoading from '@/common/LoadingMasker/withLoading';
// import BaseRouteLink from "@/common/BaseRouteLink";
import {withStyles, Theme, createStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {pushLocation} from "@/rootStore/router/actions";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import formatTime from '@/utils/formatTime';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';


const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = (theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
  },
  searchField: {
    display: 'flex',
  },
  textField: {
    display: 'flex',
    flex: '1 1 auto',
    width: '30%',
    marginRight: theme.spacing(1),
  },
  search: {
    // color: theme.custom.colors.common.white,
  },
  table: {
    minWidth: 700,
  },
});

interface IndexProps {
  classes: any;
  blockList: any;
  getBlockList: (data: any, callback?: any) => any;
  transactionList: any;
  getTransactionList: (data: any, callback?: any) => any;
  pushLocation: (data: any) => any;
}


interface IndexState {
  value: string
}

class Index extends PureComponent<IndexProps, IndexState> {
  static defaultProps = {
    blockList: null,
    getBlockList: () => {},
    transactionList: null,
    getTransactionList: () => {},
    pushLocation: () => {},
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      value: ''
    };
  }

  componentDidMount() {
    this.props.getBlockList({ page: 1 });
    this.props.getTransactionList({ page: 1 });
  }

  onChange = (event: any) => {
    const { value } = event.target;
    console.log('onChange', value);
    this.setState({ value });
  };

  onSearch = () => {
    console.log('onSearch', this.state.value);
    this.props.pushLocation(`/search/${this.state.value.trim()}`)
  };

  render() {
    const { blockList, transactionList } = this.props;
    // if (!blockList || !transactionList) {
    //   return null;
    // }
    const hitsBlocks = blockList ? blockList.hits.hits : [];
    const hitsTransactions = transactionList ? transactionList.hits.hits : [];
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.searchField}>
          <TextField
            id="standard-basic"
            className={classes.textField}
            value={this.state.value}
            label="Search by block/tx hash"
            onChange={this.onChange}
          />
          <Button
            className={classes.search}
            color="primary"
            variant="contained"
            onClick={this.onSearch}
          >
            <Typography className={classes.search} variant="body1">
              SEARCH
            </Typography>
          </Button>
        </div>
        <br />
        <div>
          Blocks List <BaseRouteLink to="/blocks">View All</BaseRouteLink>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Height</StyledTableCell>
                  <StyledTableCell align="right">Time</StyledTableCell>
                  <StyledTableCell align="right">Transactions</StyledTableCell>
                  <StyledTableCell align="right">Author</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  hitsBlocks.slice(0, 10).sort((a: any, b: any) => b._source.header.number - a._source.header.number).map((row: any) => {
                    const header = row._source.header;
                    const blockUrl = `/blocks/detail/${header.block_hash}`;
                    // TODO: author info need to be decoded from sdk
                    const authorUrl = `/author/${header.author}`;
                    return(
                      <StyledTableRow key={header.block_hash}>
                        <StyledTableCell component="th" scope="row">
                          <BaseRouteLink to={blockUrl}>{header.number}</BaseRouteLink>
                        </StyledTableCell>
                        <StyledTableCell align="right"><Typography>{formatTime(header.timestamp)}</Typography></StyledTableCell>
                        <StyledTableCell align="right">{row._source.body.Full.length}</StyledTableCell>
                        <StyledTableCell align="right">
                          <BaseRouteLink to={authorUrl}>{header.author}</BaseRouteLink>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          Transaction List <BaseRouteLink to="/transactions">View All</BaseRouteLink>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableBody>
                {
                  hitsTransactions.slice(0, 10).map((row: any) => {
                    const transaction_hash = row._source.transaction_hash;
                    const transactionUrl = `/transactions/detail/${transaction_hash}`;
                    return(
                      <StyledTableRow key={transaction_hash}>
                        <StyledTableCell component="th" scope="row">
                          <BaseRouteLink to={transactionUrl}>{transaction_hash}</BaseRouteLink>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Index);