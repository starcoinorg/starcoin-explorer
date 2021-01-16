import React, { PureComponent } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import formatNumber from '@/utils/formatNumber';
import CommonTime from '@/common/Time';
import CommonLink from '@/common/Link';
import PageView from '@/common/View/PageView';
import Table from '@/common/Table';
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
    const { transaction, classes } = this.props;
    const source = transaction.hits.hits[0]._source;
    const eventValues: any[] = [];
    const keyValues: any[] = [];
    const seqNumberValues: any[] = [];
    source.events.forEach((event: any) => {
      eventValues.push(<CommonLink path={`/events/detail/${event.data}`} title={event.data} />);
      keyValues.push(event.event_key);
      seqNumberValues.push(formatNumber(event.event_seq_number));
    });
    const columns = [
      {
        name: 'Event',
        values: eventValues,
        className: classes.shrinkMaxCol,
      },
      {
        name: 'Key',
        values: keyValues,
        className: classes.shrinkCol,

      },
      {
        name: 'SeqNumber',
        values: seqNumberValues,
        minWidth: true,
      },
    ];

    return (
      <div>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Events</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              <Table columns={columns} />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    console.log('asdf');
    const payloadInHex = '0x00ea01a11ceb0b0100000007010004030416041a04051e1d073b42087d10068d010a0000000101020000000003010201010004020300000504050101010803080103010a020105010103060c05040004060c050a020403050103010900074163636f756e74064572726f727310696e76616c69645f617267756d656e740e6372656174655f6163636f756e74096578697374735f6174087061795f66726f6d0000000000000000000000000000000103086500000000000000010106071a0a01110220030505150b0238000c040a010a0421070011000c060c050b0503150b00010b06270b000a010a0338010201070000000000000000000000000000000103535443035354430003030000000000000000000000000a550c18040002e8030000000000000000000000000000';
    const txnPayload = encoding.decodeTransactionPayload(payloadInHex);
    console.log(JSON.stringify(txnPayload, undefined, 2));
    const { transaction } = this.props;
    if (!transaction) {
      return null;
    }
    const source = transaction.hits.hits[0]._source;
    const columns = [
      ['Hash', source.transaction_hash],
      ['Block Hash', <CommonLink path={`/blocks/detail/${source.block_hash}`} title={source.block_hash} />],
      ['Block Height', formatNumber(source.block_number)],
      ['Time', <CommonTime time={source.user_transaction.raw_txn.expiration_timestamp_secs * 1000} />],
      ['State Root Hash', <CommonLink path={`/blocks/detail/${source.state_root_hash}`} title={source.state_root_hash} />],
      ['Status', source.status],
      ['Gas Used', source.gas_used],
    ];

    return (
      <PageView
        id={source.transaction_hash}
        title="Transaction"
        name="Transaction"
        pluralName="Transaction"
        searchRoute="/transaction"
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(Index);
