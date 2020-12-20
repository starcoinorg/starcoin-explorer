import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

const reducers = {
};

const createRootReducer = (history: any) => (state: any, action: any) => {
  return combineReducers({
    router: connectRouter(history),
    ...reducers
  })(state, action);
};

export default createRootReducer;
