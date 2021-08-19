import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Tokens/store';
import * as types from '@/Tokens/store/constants';
// import * as typesTransactions from '@/Transactions/store/constants';
// import storeTransactions from '@/Transactions/store';
import Index from './index';


const { selector: currentSelector, actions } = store;
//const { selector: currentSelectorTransactions, actions: actionsTransactions } = storeTransactions;

// const loadingSelector = createLoadingSelector([types.GET_BLOCK, types.GET_BLOCK_BY_HEIGHT, typesTransactions.GET_BLOCK_TRANSACTIONS, typesTransactions.GET_BLOCK_TRANSACTIONS_BY_HEIGHT]);
const loadingSelector = createLoadingSelector([types.GET_TOKEN_INFO]);

/*
const selector = createSelector(
  currentSelector,
  currentSelectorTransactions,
  loadingSelector,
  (current, transactions, loading) => ({
    block: current.block,
    blockTransactions: transactions.blockTransactions,
    loading
  })
);

export default connect(selector, {
  getBlock: actions.getBlock,
  getBlockByHeight: actions.getBlockByHeight,
  getBlockTransactions: actionsTransactions.getBlockTransactions,
  getBlockTransactionsByHeight: actionsTransactions.getBlockTransactionsByHeight
})(Index) as any;
*/

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    tokenInfo: current.tokenInfo,
    loading
  })
);

export default connect(selector, {
  getTokenInfo: actions.getTokenInfo
})(Index) as any;