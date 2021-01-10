import React, { PureComponent } from 'react';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import BlockTable from '../Blocks/components/Table';
import TransactionTable from '../Transactions/components/Table';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    searchCard: {
      marginBottom: theme.spacing(1),
    },
    blocks: {
      marginBottom: theme.spacing(1),
    },
    cardHeader: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    searchField: {
      padding: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    searchCard: {
      marginBottom: theme.spacing(2),
    },
    cardHeader: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    searchField: {
      padding: theme.spacing(2),
    },
  },
  [theme.breakpoints.down('md')]: {
    blocksAndTransactions: {
      flexWrap: 'wrap',
    },
    blocks: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    transactions: {
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {
    blocks: {
      width: '50%',
    },
    blocksSpacer: {
      paddingRight: theme.spacing(1),
    },
    transactions: {
      width: '50%',
    },
    transactionsSpacer: {
      paddingLeft: theme.spacing(1),
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
  },
  searchCard: {
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },

  blocksAndTransactions: {
    display: 'flex',
  },
  blocks: {
    flex: '1 1 auto',
  },
  blocksSpacer: {},
  transactionsSpacer: {},
  transactions: {
    flex: '1 1 auto',
  },
  searchField: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
  },
  textField: {
    display: 'flex',
    flex: '1 1 auto',
    marginRight: theme.spacing(1),
  },
  button: {
    height: theme.spacing(5),
  },
  search: {
  },
  title: {
    fontSize: '1.3125rem',
    fontWeight: 700
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
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    getBlockList: () => {},
    transactionList: null,
    getTransactionList: () => {},
    pushLocation: () => {}
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
    this.setState({ value });
  };

  onSearch = () => {
    this.props.pushLocation(`/search/${this.state.value.trim()}`);
  };

  renderCard = (
    title: string,
    url: string,
    content: any,
    cardClassName: any,
    cardSpacerClassName: any,
  ) => (
    <div className={cardClassName}>
      <div className={cardSpacerClassName}>
        <Card className={this.props.classes.card}>
          <div className={this.props.classes.cardHeader}>
            <Typography className={this.props.classes.title} variant="h4">{title}</Typography>
            <Button
              className={this.props.classes.button}
              color="primary"
              variant="contained"
              onClick={() => this.props.pushLocation(url)}
            >
              <Typography className={this.props.classes.search} variant="body1">
                View All
              </Typography>
            </Button>
          </div>
          {content}
        </Card>
      </div>
    </div>
  );

  render() {
    // if (!blockList || !transactionList) {
    //   return null;
    // }
    const { blockList, transactionList, classes } = this.props;
    const blocksHit = blockList ? blockList.hits.hits : [];
    const blocks = blocksHit.slice(0, 12);
    const transactionHit = transactionList ? transactionList.hits.hits : [];
    const transactions = transactionHit.slice(0, 15);
    return (
      <>
        <div className={classes.searchCard}>
          <Card className={this.props.classes.card}>
            <div className={this.props.classes.cardHeader}>
              <Typography className={classes.title} variant="h4">Starcoin Explorer</Typography>
            </div>
            <div className={classes.searchField}>
              <TextField
                id="standard-basic"
                className={classes.textField}
                value={this.state.value}
                label="Search by block/tx hash"
                onChange={this.onChange}
              />
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={this.onSearch}
              >
                <Typography className={classes.search} variant="body1">
                  SEARCH
                </Typography>
              </Button>
            </div>
          </Card>
        </div>
        <div className={classes.blocksAndTransactions}>
          {this.renderCard(
            'Explore Blocks',
            '/blocks',
            <BlockTable
              blocks={blocks}
              sizeVisibleAt="xs"
              authorVisibleAt="md"
            />,
            classes.blocks,
            classes.blocksSpacer,
          )}
          {this.renderCard(
            'Explore Transactions',
            '/transactions',
            <TransactionTable
              transactions={transactions}
            />,
            classes.transactions,
            classes.transactionsSpacer,
          )}
        </div>
      </>
    );
  }
}

export default withStyles(useStyles)(Index);
