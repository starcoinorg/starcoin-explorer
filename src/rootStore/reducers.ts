import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import transactions from '@/Transactions/store';

const reducers = {
  [transactions.SCOPENAME]: transactions.reducer,
};

const createRootReducer = (history: any) => (state: any, action: any) => {
  return combineReducers({
    router: connectRouter(history),
    ...reducers
  })(state, action);
};

export default createRootReducer;
