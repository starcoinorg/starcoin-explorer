import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { withTranslation } from 'react-i18next';
import { withStyles, createStyles } from '@mui/styles';
import {
  getAddressData, getBalancesData, getAddressSTCBalance,
  getAddressResources, getAddressModuleUpdateStrategy,
  getAddressUpgradeModuleCapability, getAddressUpgradePlanCapability,
} from '@/utils/sdk';
import { getNetwork, formatResources } from '@/utils/helper';
import Box from '@mui/material/Box';
import { Tab,Tabs } from '@mui/material';
import Card from '@mui/material/Card';
import ScanTabPanel,{a11yProps} from '@/common/TabPanel';
import Loading from '@/common/Loading';
import ResourceView from '@/common/View/ResourceView';
import TransferTransactionTable from '@/Transactions/components/Table/TransferTransactionTable';
import PageView from '@/common/View/PageView';
import TokenTable from '@/Address/components/TokenTable';
import AddressNotFound from '../Error404/address';
import { RoutedProps, withRouter } from '@/utils/withRouter';
import CodeTable from '@/Address/components/CodeTable';

const useStyles = (theme: any) => createStyles({
  table: {
    width: '100%',
  },
  shrinkMaxCol: {
    flex: '1 100 auto',
    minWidth: 60,
  },
  shrinkCol: {
    flex: '1 10 auto',
  },
  button: {
    marginLeft: '1rem',
    marginBottom: '1rem',
  },
  card:{
    marginTop:theme.spacing(2),
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    flexDirection: 'column',
  },
});

const moduleUpdateStrategy = [
  'ARBITRARY',
  'TWO_PHASE',
  'NEW_MODULE',
  'FREEZE',
  'TWO_PHASE + DAO（T）',
];

interface IndexProps extends RoutedProps{
  t: any,
  classes: any;
  path: any;
  addressTransactions: any;
  getAddressTransactions: (data: any, callback?: any) => any;
  pushLocation: (data: any) => any;
  location: any;
}

interface IndexState {
  addressData: any,
  balancesData: any,
  accountStatus: any,
  accountResources: any,
  accountModuleUpdateStrategy: number,
  accountUpgradePlanCapability: any,
  accountUpgradeModuleCapability: any,
  expandBalance:boolean,
  tabSelect:number
}


class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    addressTransactions: null,
    getAddressTransactions: () => {
    },
    pushLocation: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);

    this.state = {
      addressData: undefined,
      balancesData: undefined,
      accountStatus: undefined,
      accountResources: undefined,
      accountModuleUpdateStrategy: 0,
      accountUpgradePlanCapability: undefined,
      accountUpgradeModuleCapability: undefined,
      expandBalance:true,
      tabSelect:0,
    };
  }

  componentDidMount() {


    const hash = this.props.params.hash;
    getAddressSTCBalance(hash).then(data => {
      if (data) {
        this.setState({ accountStatus: data });
      } else {
        this.setState({ accountStatus: 'nonexist' });
      }
    });
    if (!this.state.addressData) {
      getAddressData(hash).then(data => {
        if (data) {
          this.setState({ addressData: data });
        }
      });
    }
    if (!this.state.balancesData) {
      getBalancesData(hash).then(data => {
        if (data) {
          this.setState({ balancesData: data });
        } else {
          console.log('get balances failed');
          this.setState({ balancesData: [] });
        }
      });
    }
    this.props.getAddressTransactions({ hash });

    getAddressResources(hash).then(data => {
      if (data) {
        this.setState({ accountResources: formatResources(data) });
      } else {
        this.setState({ accountResources: 'noResource' });
      }
    });

    getAddressUpgradePlanCapability(hash).then(data => {
      if (data) {
        this.setState({ accountUpgradePlanCapability: data });
      } else {
        this.setState({ accountUpgradePlanCapability: null });
      }
    });

    getAddressUpgradeModuleCapability(hash).then(data => {
      if (data) {
        this.setState({ accountUpgradeModuleCapability: data });
      } else {
        this.setState({ accountUpgradeModuleCapability: null });
      }
    });

    getAddressModuleUpdateStrategy(hash).then(data => {
      if (data) {
        if (data[0] === 1) {
          if (this.state.accountUpgradePlanCapability) {
            this.setState({ accountModuleUpdateStrategy: 1 });
          } else {
            if (this.state.accountUpgradeModuleCapability) {
              this.setState({ accountModuleUpdateStrategy: 4 });
            }
            this.setState({ accountModuleUpdateStrategy: 1 });
          }
        }
        this.setState({ accountModuleUpdateStrategy: data[0] });
      } else {
        this.setState({ accountModuleUpdateStrategy: 0 });
      }
      // console.log(this.state.accountModuleUpdateStrategy)
    });
  }

  generateExtraTabs(){

    const { addressTransactions, t,classes } = this.props;
    const { balancesData} = this.state;
    const hash = this.props.params.hash;
    const { accountResources } = this.state;
    const isInitialLoad = !addressTransactions && !accountResources;
    const transactions = addressTransactions && addressTransactions.contents || [];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      this.setState({tabSelect:newValue});
    };

    return (

      <Card className={classes.card}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}  classes={classes.accordion}>
            <Tabs  value={this.state.tabSelect} onChange={handleChange} aria-label="basic tabs example">
              <Tab  label={t('header.tokens')} {...a11yProps(0)} />
              <Tab label="Transactions" {...a11yProps(1)} />
              <Tab label="Resources" {...a11yProps(2)} />
              <Tab label="Codes" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <ScanTabPanel value={this.state.tabSelect} index={0}>
            {isInitialLoad ? <Loading /> : <TokenTable data={balancesData}/>}
          </ScanTabPanel>
          <ScanTabPanel value={this.state.tabSelect} index={1}>
            {isInitialLoad ? <Loading /> : <TransferTransactionTable
              transactions={transactions}
              address={hash}
            />}
            <Button
              className={this.props.classes.button}
              color='primary'
              variant='contained'
              onClick={() => {
                this.props.pushLocation(`/${getNetwork()}/address_transactions/${hash}/1`);
              }}
            >
              <Typography className={this.props.classes.search} variant='body1'>
                {t('home.viewAll')}
              </Typography>
            </Button>
          </ScanTabPanel>
          <ScanTabPanel value={this.state.tabSelect} index={2}>
            {isInitialLoad ? <Loading /> : <ResourceView resources={accountResources} />}
          </ScanTabPanel>
          <ScanTabPanel value={this.state.tabSelect} index={3}>
            {isInitialLoad ? <Loading /> : <CodeTable address={hash} />}
          </ScanTabPanel>
        </Box>
      </Card>

    );



  }


  render() {
    const { t } = this.props;
    const { addressData, balancesData, accountStatus, accountModuleUpdateStrategy } = this.state;
    const hash = this.props.params.hash;

    if (accountStatus === undefined) {
      return <Loading />;
    } else if (accountStatus === 'nonexist') {
      return <AddressNotFound address={hash} />;
    }
    if (!addressData || !balancesData) {
      return null;
    }

    const columns = [
      [t('common.Hash'), this.props.params.hash],
      [t('account.Authentication Key'), addressData.authentication_key],
      [t('common.Sequence Number'), addressData.sequence_number],
      [t('account.Module Upgrade Strategy'), moduleUpdateStrategy[accountModuleUpdateStrategy]],
    ];

    return (
      <PageView
        id={this.props.params.hash}
        title='Address'
        name='Address'
        bodyColumns={columns}
        extra={this.generateExtraTabs()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
