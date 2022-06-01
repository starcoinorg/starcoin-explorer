import React from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@mui/styles';
import formatNumber from '@/utils/formatNumber';
import { getNetwork } from '@/utils/helper';
import Table from '@/common/Table';
import BaseRouteLink from '@/common/BaseRouteLink';
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
  tokenPrecision: any,
  sizeVisibleAt: string,
  authorVisibleAt: string,
  className?: string,
}

interface InternalProps {
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps {
}

class Index extends React.PureComponent<Props> {
  render() {
    // const { tokenHolders, tokenPrecision, authorVisibleAt, className, classes, t } = this.props;
    const { tokenHolders, authorVisibleAt, className, classes, t } = this.props;
    const holders = tokenHolders.contents;
    const holderValues: any[] = [];
    const amountValues: any[] = [];
    const ratioValues: any[] = [];
    holders.forEach((holder: any) => {
      const holderUrl = `/${getNetwork()}/address/${holder.address}`;
      holderValues.push(<BaseRouteLink to={holderUrl}>{holder.address}</BaseRouteLink>);
      // amountValues.push(formatNumber(holder.amount / tokenPrecision));
      amountValues.push(formatNumber(holder.amount));
      ratioValues.push(`${formatNumber((holder.amount / holder.supply) * 100, { decimalPlaces: 6 })}%`);
    });
    const columns = [
      {
        name: t('token.address'),
        values: holderValues,
        minWidth: false,
        // visibleAt: authorVisibleAt,
        className: classes.validatorCol,
      },
      {
        name: t('token.amount'),
        values: amountValues,
        minWidth: true,
      },
      {
        name: t('token.positionratio'),
        // numeric: true,
        values: ratioValues,
        visibleAt: authorVisibleAt,
        // className: classes.transactionsCol,
      },
    ];
    return <Table className={className} columns={columns} />;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
