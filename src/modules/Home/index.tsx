import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles, createStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CenteredView from '@/common/View/CenteredView';
import { getEpochData } from '@/utils/sdk';
import { getNetwork } from '@/utils/helper';
import formatTime from '@/utils/formatTime';
import formatNumber from '@/utils/formatNumber';
import { InputLabel } from '@mui/material';
import BlockTable from '../Blocks/components/Table';
import TransactionTable from '../Transactions/components/Table';

const useStyles = (theme: any) => createStyles({
  [theme.breakpoints.down('md')]: {
    cardContainer: {
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
    title: {
      fontSize: '1.125rem',
    },
    metric: {
      paddingLeft: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('sm')]: {
    cardContainer: {
      marginBottom: theme.spacing(2),
    },
    cardHeader: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    searchField: {
      padding: theme.spacing(2),
    },
    title: {
      fontSize: '1.325rem',
    },
    metric: {
      paddingLeft: theme.spacing(4),
    },
  },
  [theme.breakpoints.down('lg')]: {
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
    textFieldLabel: {
      fontSize: '0.75em',
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
    textFieldLabel: {
      fontSize: '1em',
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',

  },
  cardContainer: {},
  card: {
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color:  theme.palette.mode === 'dark' ? theme.palette.getContrastText(theme.palette.background.paper) : undefined ,
    flexDirection: 'column',
  },
  cardHeader: {
    alignItems: 'center',
    borderBottom: theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)',
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
    "& .MuiInputBase-input":{
      color: theme.palette.getContrastText(theme.palette.background.paper),
      borderColor:"red",

    },
    "& .MuiInputLabel-root":{
      color:  theme.palette.mode === 'dark' ? theme.palette.grey[500] : undefined ,
    }
  },
  textFieldLabel: {},
  button: {
    height: theme.spacing(5),
  },
  search: {},
  title: {
    fontWeight: 700,
  },
  metric: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderLeft: theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)',
  },
});

interface IndexProps {
  classes: any;
  t: any;
  i18n: any;
  blockList: any;
  getBlockList: (data: any, callback?: any) => any;
  transactionList: any;
  getTransactionList: (data: any, callback?: any) => any;
  pushLocation: (data: any) => any;
  location: any;
}

interface IndexState {
  value: string,
  epochData: any
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    getBlockList: () => {
    },
    transactionList: null,
    getTransactionList: () => {
    },
    pushLocation: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      value: '',
      epochData: null,
    };
  }

  componentDidMount() {
    // const currentNetwork = getNetwork();
    /*
    if (currentNetwork === 'main') {
      window.location.href = '/main';
    }
    */

    // check redirection
    const { location } = this.props;
    if (location.state) {
      const newNetwork = location.state.network;
      localStorage.setItem('network', newNetwork);
      this.props.getBlockList({ network: newNetwork, page: 1 });
      this.props.getTransactionList({ network: newNetwork, page: 1 });
    } else {
      this.props.getBlockList({ page: 1 });
      this.props.getTransactionList({ page: 1 });
    }
    getEpochData().then(data => {
      if (data) {
        this.setState({ epochData: data });
      }
    });
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
            <Typography className={this.props.classes.title} variant='h4'>{title}</Typography>
            <Button
              className={this.props.classes.button}
              color='primary'
              variant='contained'
              onClick={() => this.props.pushLocation(url)}
            >
              <Typography className={this.props.classes.search} variant='body1'>
                {this.props.t('home.viewAll')}
              </Typography>
            </Button>
          </div>
          {content}
        </Card>
      </div>
    </div>
  );

  render() {
    const { blockList, transactionList, classes, t, i18n } = this.props;
    const blocksHit = blockList && blockList.contents && blockList.contents ? blockList.contents : [];
    const blocks = blocksHit.slice(0, 12);
    const transactionHit = transactionList && transactionList.contents ? transactionList.contents : [];
    const transactions = transactionHit.slice(0, 15);
    const metrics: any[] = [];
    if (this.state.epochData) {
      metrics.push(['Epoch', `${this.state.epochData.number}th`]);
      metrics.push([t('home.EpochStartTime'), formatTime(this.state.epochData.start_time, i18n.language)]);
      metrics.push([t('home.StartEndBlock'), `${formatNumber(this.state.epochData.start_block_number)} - ${formatNumber(this.state.epochData.end_block_number)}`]);
      metrics.push([t('home.TargetBlockTime'), formatNumber((this.state.epochData.block_time_target / 1000).toFixed(0))]);
      if (blocks && blocks.length > 0 && this.state.epochData.block_time_target > 0) {
        // const currentBlockDiff = Number(blocks[0]._source.header.difficulty);
        // const currentHashRate = formatNumber((currentBlockDiff / this.state.epochData.block_time_target * 1000).toFixed(0));
        let totalDiff = 0;
        for (let i = 0; i < blocksHit.length; i++) {
          totalDiff += blocksHit[i].header.difficulty_number;
        }
        const averageBlockDiff = Number(totalDiff / blocksHit.length);
        const endTime = blocksHit[0].header.timestamp;
        const startTime = blocksHit[blocksHit.length - 1].header.timestamp;
        const averageBlockTime = Number((endTime - startTime) / blocksHit.length);
        const averageHashRate = formatNumber((averageBlockDiff / averageBlockTime * 1000).toFixed(0));
        metrics.push([t('home.CurrentHashRate'), averageHashRate]);
      }
    }
    const transactionsList = transactions.length ? (
      <TransactionTable
        transactions={transactions}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('transaction.NoTransactionData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return <>
      <div className={classes.cardContainer}>
        <Card className={this.props.classes.card}>
          <div className={this.props.classes.cardHeader}>
            <Typography className={classes.title} variant='h4'>Starcoin {t('home.explorer')}</Typography>
          </div>
          <div className={classes.searchField}>
            <InputLabel  id="custom-css-outlined-input" />
            <TextField
              className={classes.textField}
              id="custom-css-outlined-input"
              variant='standard'
              value={this.state.value}
              label={t('home.searchHint')}
              InputLabelProps={{ className: classes.textFieldLabel }}
              onChange={this.onChange}
            />
            <Button
              className={classes.button}
              color='primary'
              variant='contained'
              onClick={this.onSearch}
            >
              <Typography className={classes.search} variant='body1'>
                {t('home.search')}
              </Typography>
            </Button>
          </div>
        </Card>
      </div>
      <div className={classes.cardContainer}>
        <Card className={this.props.classes.card}>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justifyContent='flex-start' spacing={0}>
                {metrics.map((metric) => (
                  <Grid key={metric[0]} item xs={6} md={4} lg={2}>
                    <div className={classes.metric}>
                      <Typography className={classes.metricTitle} variant='body2'>
                        {metric[0]}
                      </Typography>
                      <Typography className={classes.title}>
                        {metric[1]}
                      </Typography>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </div>
      <div className={classes.blocksAndTransactions}>
        {this.renderCard(
          t('home.ExploreBlocks'),
          `/${getNetwork()}/blocks/1`,
          <BlockTable
            blocks={blocks}
            sizeVisibleAt='xs'
            authorVisibleAt='md'
          />,
          classes.blocks,
          classes.blocksSpacer,
        )}
        {this.renderCard(
          t('home.ExploreTransactions'),
          `/${getNetwork()}/transactions/list`,
          transactionsList,
          classes.transactions,
          classes.transactionsSpacer,
        )}
      </div>
    </>;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
