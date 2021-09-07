import React from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Table from '@/common/Table';
import BaseRouteLink from '@/common/BaseRouteLink';
import formatNumber from '@/utils/formatNumber';
import { getNetwork } from '@/utils/helper';
import { SCALING_FACTOR } from '@/utils/scalingFactor';
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
  tokens: any,
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
    const { tokens, authorVisibleAt, className, classes, t } = this.props;
    const holdersValues: any[] = [];
    const marketCapValues: any[] = [];
    const volumeValues: any[] = [];
    const tokenInfoValues: any[] = [];
    tokens.forEach((token: any) => {
      // const header = block.header;
      const tokenInfoURL = `/${getNetwork()}/tokens/detail/${token.type_tag}`;
      const holdersListURL = `/${getNetwork()}/tokens/holders/${token.type_tag}/1`;
      holdersValues.push(<BaseRouteLink to={holdersListURL}>{formatNumber(token.addressHolder)}</BaseRouteLink>);
      marketCapValues.push(formatNumber( (token.market_cap) / parseInt(SCALING_FACTOR[token.type_tag],10) ));

      if (token.type_tag === '0x00000000000000000000000000000001::STC::STC') {
        volumeValues.push(formatNumber(token.volume));
      } else {
        volumeValues.push(formatNumber( (token.volume) / parseInt(SCALING_FACTOR[token.type_tag],10) ));
      }

      tokenInfoValues.push(
        <BaseRouteLink to={tokenInfoURL}>{token.type_tag}</BaseRouteLink>
      );
    });
    const columns = [
      {
        name: t('token.address'),
        values: tokenInfoValues,
        visibleAt: authorVisibleAt,
        className: classes.validatorCol,
      },
      {
        name: t('token.totalsupply'),
        values: marketCapValues,
        minWidth: true,
      },
      {
        name: t('token.holdercount'),
        values: holdersValues,
        minWidth: true,
      },
      {
        name: t('token.position'),
        numeric: true,
        values: volumeValues,
        minWidth: true,
        // className: classes.transactionsCol,
      },
    ];
    return <Table className={className} columns={columns} />;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
