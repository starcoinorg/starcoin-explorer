import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Transactions/store';
import * as types from '@/Transactions/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_TRANSACTION_LIST]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    transactionList: current.transactionList,
    loading
  })
);

export default connect(selector, {
  getTransactionList: actions.getTransactionList
})(Index) as any;