import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@mui/styles';
import Loading from '@/common/Loading';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import formatNumber from '@/utils/formatNumber';

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
  uncleBlock: any;
  getUncleBlock: (data: any, callback?: any) => any;
  getUncleBlockByHeight: (data: any, callback?: any) => any;
}

interface IndexState {
  epochData: any,
  hash?: string,
  height?: string,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    uncleBlock: null,
    getUncleBlock: () => {
    },
    getUncleBlockByHeight: () => {
    },
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      epochData: undefined,
      hash: props.match.params.hash,
      height: props.match.params.height,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    // switch hash only in current page, won't switch height
    // so only need to empty height while switch to /hash/xxx from height/xxx
    if (nextProps.match.params.hash !== prevState.hash) {
      return { ...prevState, hash: nextProps.match.params.hash, height: '' };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.match.params.hash !== this.state.hash && prevState.hash !== this.state.hash) {
      this.fetchData();
    }
  }

  fetchData() {
    const hash = this.state.hash;
    const height = this.state.height;
    if (hash) {
      this.props.getUncleBlock({ hash });
    }
    if (height) {
      this.props.getUncleBlockByHeight({ height });
    }
  }

  render() {
    const { uncleBlock, match, t } = this.props;
    const network = match.params.network;
    const isInitialLoad = !uncleBlock;
    if (isInitialLoad) {
      return <Loading />;
    }
    if (!uncleBlock.header) {
      return null;
    }
    const header = uncleBlock.header;
    const columns = [
      [t('common.Hash'), header.block_hash],
      [t('uncleblock.Height'), formatNumber(header.number)],
      [t('common.Time'), `${new Date(parseInt(header.timestamp, 10)).toLocaleString()} ${new Date().toTimeString().slice(9)}`],
      [t('uncleblock.Author'),
        <CommonLink key={header.author} path={`/${network}/address/${header.author}`} title={header.author} />],
      [t('uncleblock.BlockAccumulatorRoot'), header.block_accumulator_root],
      [t('uncleblock.Difficulty'), formatNumber(header.difficulty_number)],
      [t('common.GasUsed'), formatNumber(header.gas_used)],
      [t('common.Nonce'), formatNumber(header.nonce)],
      [t('uncleblock.ParentHash'),
        <CommonLink key={header.parent_hash} path={`/${network}/blocks/detail/${header.parent_hash}`}
                    title={header.parent_hash} />],
    ];

    return (
      <PageView
        id={header.block_hash}
        title={t('uncleblock.header')}
        name={t('uncleblock.header')}
        pluralName={t('uncleblock.header')}
        bodyColumns={columns}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
