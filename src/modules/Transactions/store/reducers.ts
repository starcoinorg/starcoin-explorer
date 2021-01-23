import * as types from './constants';

const initState = {
  transaction: null,
  transactionList: null,
  addressTransactions: null,
  isLoadingMore: false,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_TRANSACTION: {
      return { ...state, transaction: action.payload };
    }
    case types.SET_TRANSACTION_LIST: {
      return { ...state, transactionList: action.payload };
    }
    case types.GET_TRANSACTION_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_TRANSACTION_LIST_SUCCESS:
    case types.GET_TRANSACTION_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    case types.SET_ADDRESS_TRANSACTIONS: {
      return { ...state, addressTransactions: action.payload };
    }
    default:
      return state;
  }
}