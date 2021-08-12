import React, { PureComponent } from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Loading from '@/common/Loading';
import ResourceView from '@/common/View/ResourceView';
import TransactionTable from '@/Transactions/components/Table';
import PageView from '@/common/View/PageView';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { getAddressData, getBalancesData, getAddressSTCBalance, getAddressResources } from '@/utils/sdk';
import { formatBalance, formatResources } from '@/utils/helper';
import AddressNotFound from '../Error404/address';

const useStyles = () => createStyles({
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
});

interface IndexProps {
  classes: any;
  computedMatch: any;
  addressTransactions: any;
  getAddressTransactions: (data: any, callback?: any) => any;
}

interface IndexState {
  addressData: any,
  balancesData: any,
  accountStatus: any,
  accountResources: any,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    addressTransactions: null,
    getAddressTransactions: () => {}
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      addressData: undefined,
      balancesData: undefined,
      accountStatus: undefined,
      accountResources: undefined
    };
  }

  componentDidMount() {
    const hash = this.props.computedMatch.params.hash;
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
          console.log('get balances failed')
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
  }

  generateExtra() {
    const { addressTransactions, classes } = this.props;
    const { accountResources } = this.state;
    const isInitialLoad = !addressTransactions && !accountResources;
    const transactions = addressTransactions && addressTransactions.contents || [];
    return (
      <div>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Transactions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              {isInitialLoad ? <Loading /> : <TransactionTable
                transactions={transactions}
              />}
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Resources</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              { isInitialLoad ? <Loading /> : <ResourceView resources={accountResources} /> }
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { addressData, balancesData, accountStatus } = this.state;
    const hash = this.props.computedMatch.params.hash;

    if (accountStatus === undefined) {
      return <Loading />;
    } else if (accountStatus === 'nonexist') {
      return <AddressNotFound address={hash} />;
    }
    if (!addressData || !balancesData) {
      return null;
    }
    const options: any[] = [];
    let value;
    Object.keys(balancesData).forEach((key, idx) => {
      value = (idx === 0) ? key : '';
      options.push(<option key={key} value={key}>{`${formatBalance(balancesData[key])} ${key.split('::')[2]}`}</option>);
    });

    const token = (
      <NativeSelect
        id="demo-customized-select-native"
        value={value}
      >
        {options}
      </NativeSelect>
    );
    const columns = [
      ['Hash', this.props.computedMatch.params.hash],
      ['Authentication Key', addressData.authentication_key],
      ['Sequence Number', addressData.sequence_number],
      ['Token', token],
    ];

    return (
      <PageView
        id={this.props.computedMatch.params.hash}
        title="Address"
        name="Address"
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(Index);
