import React from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Table from '@/common/Table';
import BaseRouteLink from '@/common/BaseRouteLink';
import formatNumber from '@/utils/formatNumber';
import { getNetwork } from '@/utils/helper';
// import CommonLink from '@/common/Link';
// import CommonTime from '@/common/Time';

const useStyles = () => createStyles({
  transactionsCol: {
    flex: '1 100 auto',
  },
  validatorCol: {
    flex: '1 100 auto',
  },
});

interface ExternalProps {
  tokenHolders: any,
  sizeVisibleAt: string,
  authorVisibleAt: string,
  className?: string,
}

interface InternalProps {
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { tokenHolders, authorVisibleAt, className, classes, t } = this.props;
    const holders = tokenHolders.contents;
    const holderValues: any[] = [];
    const marketCapValues: any[] = [];
    const amountValues: any[] = [];
    holders.forEach((holder: any) => {
      const holderUrl = `/${getNetwork()}/address/${holder.address}`;
      holderValues.push(<BaseRouteLink to={holderUrl}>{holder.address}</BaseRouteLink>);
      amountValues.push(formatNumber(holder.amount));
      marketCapValues.push(formatNumber(holder.supply));
    });
    const columns = [
      {
        name: t('token.address'),
        values: holderValues,
        visibleAt: authorVisibleAt,
        className: classes.validatorCol,
      },
      {
        name: t('token.amount'),
        values: amountValues,
        minWidth: true,
      },
      {
        name: t('token.totalsupply'),
        numeric: true,
        values: marketCapValues,
        className: classes.transactionsCol,
      },
    ];
    return <Table className={className} columns={columns} />;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
