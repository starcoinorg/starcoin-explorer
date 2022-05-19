import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Tokens/store';
import * as types from '@/Tokens/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_TOKEN_TRANSACTION_LIST]);


const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    tokenTransactionList: current.tokenTransactionList,
    isLoadingMore: current.isLoadingMore,
    loading,
  }),
);


export default connect(selector, {
  getTokenTransactionList: actions.getTokenTransactionList,
})(Index as any) as any;