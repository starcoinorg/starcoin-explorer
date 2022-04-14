import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Blocks/store';
import * as types from '@/Blocks/store/constants';
import * as typesTransactions from '@/Transactions/store/constants';
import storeTransactions from '@/Transactions/store';
import Index from './index';

const { selector: currentSelector, actions } = store;
const { selector: currentSelectorTransactions, actions: actionsTransactions } = storeTransactions;

const loadingSelector = createLoadingSelector([types.GET_UNCLE_BLOCK, types.GET_UNCLE_BLOCK_BY_HEIGHT, typesTransactions.GET_BLOCK_TRANSACTIONS, typesTransactions.GET_BLOCK_TRANSACTIONS_BY_HEIGHT]);

const selector = createSelector(
  currentSelector,
  currentSelectorTransactions,
  loadingSelector,
  (current, transactions, loading) => ({
    block: current.block,
    uncleBlock: current.uncleBlock,
    blockTransactions: transactions.blockTransactions,
    loading,
  }),
);

export default connect(selector, {
  getUncleBlock: actions.getUncleBlock,
  getUncleBlockByHeight: actions.getUncleBlockByHeight,
  getBlockTransactions: actionsTransactions.getBlockTransactions,
  getBlockTransactionsByHeight: actionsTransactions.getBlockTransactionsByHeight,
})(Index as any) as any;