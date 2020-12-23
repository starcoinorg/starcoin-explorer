import * as types from './constants';

const initState = {
  transaction: null,
  transactionList: null,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_TRANSACTION: {
      return { ...state, transaction: action.payload };
    }
    case types.SET_TRANSACTIONS_LIST: {
      return { ...state, transactionList: action.payload };
    }
    default:
      return state;
  }
}