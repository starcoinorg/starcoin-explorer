import * as types from './constants';

const initState = {
  tokenInfo: null,
  tokenList: null,
  tokenHolderList: null,
  tokenTransactionList: null,
  isLoadingMore: false,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_TOKEN_INFO: {
      return { ...state, tokenInfo: action.payload };
    }
    case types.SET_TOKEN_LIST: {
      return { ...state, tokenList: action.payload };
    }
    case types.SET_TOKEN_HOLDER_LIST: {
      return { ...state, tokenHolderList: action.payload };
    }
    case types.SET_TOKEN_TRANSACTION_LIST: {
      return { ...state, tokenTransactionList: action.payload };
    }
    case types.GET_TOKEN_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_TOKEN_HOLDER_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_TOKEN_TRANSACTION_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_TOKEN_LIST_SUCCESS:
    case types.GET_TOKEN_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    case types.GET_TOKEN_HOLDER_LIST_SUCCESS:
    case types.GET_TOKEN_HOLDER_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    case types.GET_TOKEN_TRANSACTION_LIST_SUCCESS:
    case types.GET_TOKEN_TRANSACTION_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    default:
      return state;
  }
}