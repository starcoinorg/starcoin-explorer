import React, { PureComponent } from 'react'
// import withLoading from '@/common/LoadingMasker/withLoading';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
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
import formatTime from '@/utils/formatTime';
import BaseRouteLink from "@/common/BaseRouteLink";

interface IndexProps {
  classes: any;
  match: any;
  block: any;
  getBlock: (data: any, callback?: any) => any;
}


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
  table: {
    minWidth: 700,
  },
});

class Index extends PureComponent<IndexProps> {
  static defaultProps = {
    match: {},
    block: null,
    getBlock: () => {}
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getBlock({ hash })
  }

  render() {
    const hash = this.props.match.params.hash;
    const { classes } = this.props;
    const { block } = this.props;
    if (!block) {
      return null;
    }
    const header = block.hits.hits[0]._source.header;
    const columns = [
      ['Hash', header.block_hash],
      ['Height', header.number],
      ['Author', header.author],
      ['Difficulty', header.difficulty],
      ['Gas Used', header.gas_used],
      ['Parant Hash', header.parent_hash],
      ['Time', formatTime(header.timestamp)],
    ];
    const transactions = block.hits.hits[0]._source.body.Full;
    return (
      <React.Fragment>
        <div>
          <h3>{`Block ${hash}`}</h3>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableBody>
                {
                  columns.map((column: any, index: number) => {
                    return(
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {column[0]}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {column[1]}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Transaction</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableBody>
                    {
                      transactions.map((row: any) => {
                        const transaction_hash = row.transaction_hash;
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
            </AccordionDetails>
          </Accordion>
          <br />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Events</Typography>
            </AccordionSummary>
            <AccordionDetails>
              TODO
            </AccordionDetails>
          </Accordion>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Index);