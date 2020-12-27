import React, { PureComponent } from 'react';
import BaseRouteLink from "@/common/BaseRouteLink";
// import withLoading from '@/common/LoadingMasker/withLoading';
// import BaseRouteLink from "@/common/BaseRouteLink";
import { withStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {pushLocation} from "@/rootStore/router/actions";

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
          <ul>
          {
            hitsBlocks.map((item: any) => {
              const url = `/blocks/detail/${item._id}`;
              return(
                <li key={item._id}>
                  <BaseRouteLink to={url}>{item._id}</BaseRouteLink>
                </li>
              )
            })
          }
          </ul>
        </div>
        <div>
          Transaction List <BaseRouteLink to="/transactions">View All</BaseRouteLink>
          <ul>
            {
              hitsTransactions.map((item: any) => {
                const url = `/transactions/detail/${item._id}`;
                return(
                  <li key={item._id}>
                    <BaseRouteLink to={url}>{item._id}</BaseRouteLink>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Index);