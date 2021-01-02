import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import Typography from '@material-ui/core/Typography';
// import withLoading from '@/common/LoadingMasker/withLoading';
import BaseRouteLink from '@/common/BaseRouteLink';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import formatTime from '@/utils/formatTime';

interface IndexProps {
  classes: any;
  blockList: any;
  getBlockList: (data: any, callback?: any) => any;
}

interface IndexState {
  currentPage: number
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

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    getBlockList: () => {}
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
    this.props.getBlockList({ page });
  };

  pagination = (type: string) => {
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getBlockList({ page }, () => { this.setState({ currentPage: page }); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getBlockList({ page }, () => { this.setState({ currentPage: page }); });
    }
  };

  render() {
    const { blockList } = this.props;
    if (!blockList) {
      return null;
    }
    const { classes } = this.props;
    const hits = blockList.hits.hits;
    const size = 20;
    const from = (this.state.currentPage - 1) * size + 1;
    const to = this.state.currentPage * size;
    return (
      <div>
        Blocks List
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
                hits.sort((a: any, b: any) => b._source.header.number - a._source.header.number).map((row: any) => {
                  const header = row._source.header;
                  const blockUrl = `/blocks/detail/${header.block_hash}`;
                  // TODO: author info need to be decoded from sdk
                  const authorUrl = `/author/${header.author}`;
                  return (
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
    );
  }
}

export default withStyles(useStyles)(Index);
