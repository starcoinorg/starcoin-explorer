import { createSelector } from 'reselect';
import get from 'lodash/get';

const createLoadingSelector = (actions: any) => (state: any) => {
  return actions.some((action: any) => get(state, `loading.${action}`));
};

export default createLoadingSelector;