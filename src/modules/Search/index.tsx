import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get';
import { getAddressData } from '@/utils/sdk';

const useStyles = () => createStyles({
  root: {
    padding: 16,
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 24,
  },
  headline: {
    paddingBottom: 8,
  },
});

interface IndexProps {
  classes: any;
  t: any;
  computedMatch: any;
  block: any;
  getBlock: (data: any, callback?: any) => any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
  addressTransactions: any;
  getAddressTransactions: (data: any, callback?: any) => any;
  pushLocation: (data: any) => any;
}

interface IndexState {
  addressData: any,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    block: null,
    getBlock: () => {},
    transaction: null,
    getTransaction: () => {},
    addressTransactions: null,
    getAddressTransactions: () => {},
    pushLocation: () => {},
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      addressData: undefined,
    };
  }

  componentDidMount() {
    const hash = this.props.computedMatch.params.hash;
    this.props.getBlock({ hash });
    this.props.getTransaction({ hash });
    this.props.getAddressTransactions({ hash });
  }

  render() {
    const { classes, t } = this.props;
    const hash = this.props.computedMatch.params.hash;
    const { block, transaction, addressTransactions } = this.props;
    const isInitialLoad = !block || !transaction || !addressTransactions;
    if (isInitialLoad) {
      return <Loading />;
    }
    let url;
    let showNone = true;
    if (block.hits.hits.length > 0) {
      if (block.hits.hits[0]._id === hash) {
        url = `/blocks/detail/${block.hits.hits[0]._id}`;
      } else {
        showNone = false;
      }
    }
    if (transaction.hits.hits.length > 0) {
      if (transaction.hits.hits[0]._id === hash) {
        url = `/transactions/detail/${transaction.hits.hits[0]._id}`;
      } else {
        showNone = false;
      }
    }
    if (addressTransactions.hits.hits.length > 0) {
      getAddressData(hash).then(data => {
        if (data) {
          this.setState({ addressData: data });
        }
      });
    }
    if (addressTransactions.hits.hits.length > 0) {
      if (get(this.state.addressData, 'withdraw_events.guid', '') === hash) {
        url = `/address/${hash}`;
      } else {
        showNone = false;
      }
    }
    if (url) {
      this.props.pushLocation(url);
    }

    if (!url && showNone) {
      return (
        <div>
          <Helmet>
            <title>404</title>
          </Helmet>
          <Grid className={classes.root} container justify="center">
            <Grid item xs={12} md={8} lg={4}>
              <Card className={classes.card}>
                <Typography variant="h5" className={classes.headline}>
                  {t('home.searchNotFound')}
                </Typography>
                <Typography variant="subtitle1">
                  {t('home.searchNotFoundDetail')}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </div>
      );
    }
    return null;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
