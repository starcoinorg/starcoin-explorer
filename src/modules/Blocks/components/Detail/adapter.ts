import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Blocks/store';
import * as types from '@/Blocks/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_BLOCK]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    block: current.block,
    loading
  })
);

export default connect(selector, {
  getBlock: actions.getBlock
})(Index) as any;