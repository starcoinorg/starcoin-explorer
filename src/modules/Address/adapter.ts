import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector from '@/rootStore/loading/selector';
import { pushLocation } from '@/rootStore/router/actions';
import storeTransactions from '@/Transactions/store';
import Index from './index';

const { selector: currentSelector } = storeTransactions;

const loadingSelector = createLoadingSelector([]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    loading,
  }),
);

export default connect(selector, {
  pushLocation,
})(Index as any) as any;