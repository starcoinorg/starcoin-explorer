import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Transactions/store';
import * as types from '@/Transactions/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_PENDING_TRANSACTION]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    pendingTransaction: current.pendingTransaction,
    loading,
  }),
);

export default connect(selector, {
  getPendingTransaction: actions.getPendingTransaction,
})(Index as any) as any;