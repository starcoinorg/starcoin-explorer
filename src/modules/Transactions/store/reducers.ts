import * as types from './constants';

const initState = {
  transaction: null,
  pendingTransaction: null,
  transactionList: null,
  pendingTransactionList: null,
  addressTransactions: null,
  blockTransactions: null,
  isLoadingMore: false,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_TRANSACTION: {
      return { ...state, transaction: action.payload };
    }
    case types.SET_PENDING_TRANSACTION: {
      return { ...state, pendingTransaction: action.payload };
    }
    case types.SET_TRANSACTION_LIST: {
      return { ...state, transactionList: action.payload };
    }
    case types.SET_PENDING_TRANSACTION_LIST: {
      return { ...state, pendingTransactionList: action.payload };
    }
    case types.GET_TRANSACTION_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_PENDING_TRANSACTION_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_TRANSACTION_LIST_SUCCESS:
    case types.GET_TRANSACTION_LIST_FAILURE:
    case types.GET_PENDING_TRANSACTION_LIST_SUCCESS:
    case types.GET_PENDING_TRANSACTION_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    case types.SET_ADDRESS_TRANSACTIONS: {
      return { ...state, addressTransactions: action.payload };
    }
    case types.SET_BLOCK_TRANSACTIONS: {
      return { ...state, blockTransactions: action.payload };
    }
    default:
      return state;
  }
}