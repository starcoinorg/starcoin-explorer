import * as actions from  './actions';
import reducer from  './reducers';
import sagas from './sagas';
import { SCOPENAME } from "./constants";

const selector = (state: any) => state[SCOPENAME];

const store = {
  SCOPENAME,
  selector,
  reducer,
  actions,
  sagas
};

export default store;