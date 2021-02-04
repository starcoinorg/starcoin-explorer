import React from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Table from '@/common/Table';
import BaseRouteLink from '@/common/BaseRouteLink';
import formatNumber from '@/utils/formatNumber';
import CommonLink from '@/common/Link';
import CommonTime from '../../../../common/Time';

const useStyles = () => createStyles({
  transactionsCol: {
    flex: '1 100 auto',
  },
  validatorCol: {
    flex: '1 100 auto',
  },
});

interface ExternalProps {
  blocks: any,
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
    const { blocks, authorVisibleAt, className, classes, t } = this.props;
    const heightValues: any[] = [];
    const timeValues: any[] = [];
    const transactionsValues: any[] = [];
    const authorValues: any[] = [];
    blocks.forEach((block: any) => {
      const header = block._source.header;
      const blockUrl = `/blocks/height/${header.number}`;
      // TODO: author info need to be decoded from sdk 3
      const authorUrl = `/address/${header.author}`;
      heightValues.push(<BaseRouteLink to={blockUrl}>{formatNumber(header.number)}</BaseRouteLink>);
      // timeValues.push(<CommonTime time={Date.now() - 5000} />);
      timeValues.push(<CommonTime time={header.timestamp} />);
      transactionsValues.push(formatNumber(block._source.body.Full.length));
      authorValues.push(
        <CommonLink path={authorUrl} title={header.author} />
      );
    });
    const columns = [
      {
        name: t('block.Height'),
        values: heightValues,
        minWidth: true,
      },
      {
        name: t('common.Time'),
        values: timeValues,
        minWidth: true,
      },
      {
        name: t('block.Transactions'),
        numeric: true,
        values: transactionsValues,
        className: classes.transactionsCol,
      },
      {
        name: t('block.Author'),
        values: authorValues,
        visibleAt: authorVisibleAt,
        className: classes.validatorCol,
      },
    ];
    return <Table className={className} columns={columns} />;
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
