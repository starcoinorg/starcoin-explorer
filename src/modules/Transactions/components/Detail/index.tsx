import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import formatNumber from '@/utils/formatNumber';
import CommonLink from '@/common/Link';
import PageView from '@/common/View/PageView';
import PageViewTable from '@/common/View/PageViewTable';
import Loading from '@/common/Loading';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { encoding } from '@starcoin/starcoin';

const useStyles = () => createStyles({
  table: {
    width: '100%',
    display: 'block',
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
  t: any;
  match: any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
}

class Index extends PureComponent<IndexProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    transaction: null,
    getTransaction: () => {}
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getTransaction({ hash });
  }

  generateExtra() {
    const { transaction, classes, t } = this.props;
    const isInitialLoad = !transaction;
    const events = transaction.hits.hits[0]._source.events || [];
    const eventsTable: any[] = [];
    events.forEach((event: any) => {
      const columns: any[] = [];
      columns.push([t('event.Data'), event.data]);
      columns.push([t('event.Key'), event.event_key]);
      columns.push([t('event.Seq'), formatNumber(event.event_seq_number)]);
      eventsTable.push(<PageViewTable key={event.event_key} columns={columns} />);
    });

    const eventsContent = events.length ? eventsTable : <Typography variant="body1">{t('event.NoEventData')}</Typography>;
    return (
      <div>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('header.events')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              <div className={classes.table}>
                {isInitialLoad ? <Loading /> : eventsContent}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { transaction, t } = this.props;
    if (!transaction) {
      return null;
    }
    const source = transaction.hits.hits[0]._source;
    const payloadInHex = source.user_transaction.raw_txn.payload || '';
    const txnPayload = encoding.decodeTransactionPayload(payloadInHex);
    const type = Object.keys(txnPayload)[0];

    const columns = [
      [t('common.Hash'), source.transaction_hash],
      [t('transaction.Type'), type],
      [t('transaction.BlockHash'), <CommonLink path={`/blocks/detail/${source.block_hash}`} title={source.block_hash} />],
      [t('transaction.BlockHeight'), formatNumber(source.block_number)],
      [t('common.Time'), new Date(parseInt(source.timestamp, 10)).toLocaleString()],
      [t('transaction.StateRootHash'), source.state_root_hash],
      [t('transaction.Status'), source.status],
      [t('common.GasUsed'), source.gas_used]
    ];

    return (
      <PageView
        id={source.transaction_hash}
        title={t('transaction.title')}
        name={t('transaction.title')}
        pluralName={t('transaction.title')}
        searchRoute="/transaction"
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
