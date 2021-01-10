import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Blocks/store';
import * as types from '@/Blocks/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_BLOCK_LIST]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    blockList: current.blockList,
    isLoadingMore: current.isLoadingMore,
    loading
  })
);

export default connect(selector, {
  getBlockList: actions.getBlockList
})(Index) as any;