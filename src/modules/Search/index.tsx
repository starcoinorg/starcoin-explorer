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
import { isHex } from '@/utils/helper';

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
  getBlockByHeight: (data: any, callback?: any) => any;
  pushLocation: (data: any) => any;
}

class Index extends PureComponent<IndexProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    block: null,
    getBlock: () => {},
    transaction: null,
    getTransaction: () => {},
    addressTransactions: null,
    getAddressTransactions: () => {},
    getBlockByHeight: () => {},
    pushLocation: () => {},
  };

  componentDidMount() {
    const hash = this.props.computedMatch.params.hash;
    if (isHex(hash)) {
      this.props.getBlock({ hash });
      this.props.getTransaction({ hash });
      this.props.getAddressTransactions({ hash });
    } else if (parseInt(hash, 10) >= 0) {
      this.props.getBlockByHeight({ height: parseInt(hash, 10) });
    }
  }

  getAddressData(hash: string) {
    getAddressData(hash).then(data => {
      if (data) {
        if (get(data, 'withdraw_events.guid', '') === hash) {
          const url = `/address/${hash}`;
          this.props.pushLocation(url);
        }
      }
    });
  }

  render() {
    const { classes, t } = this.props;
    const hash = this.props.computedMatch.params.hash;
    const { block, transaction, addressTransactions } = this.props;
    if (isHex(hash) && (!block || !transaction || !addressTransactions)) {
      return <Loading />;
    }
    let url;
    let showNone = true;

    if (block && block.hits.hits.length > 0) {
      if (isHex(hash) && get(block, 'hits.hits[0]._id') === hash) {
        url = `/blocks/detail/${block.hits.hits[0]._id}`;
      } else if (get(block, 'hits.hits[0]._source.header.number', undefined) === hash) {
        url = `/blocks/height/${hash}`;
      }
    }
    if (isHex(hash) && transaction && transaction.hits.hits.length > 0) {
      if (get(transaction, 'hits.hits[0]._id') === hash) {
        url = `/transactions/detail/${transaction.hits.hits[0]._id}`;
      } else {
        showNone = false;
      }
    }
    if (isHex(hash) && addressTransactions && addressTransactions.hits.hits.length > 0) {
      this.getAddressData(hash);
      showNone = false;
    }

    if (url) {
      this.props.pushLocation(url);
      return null;
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
    return <Loading />;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
