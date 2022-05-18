import * as types from './constants';

export function getTokenInfo(payload: any) {
  return {
    type: types.GET_TOKEN_INFO,
    payload,
  };
}

export function setTokenInfo(payload: any) {
  return {
    type: types.SET_TOKEN_INFO,
    payload,
  };
}

export function getTokenList(payload: any, callback?: any) {
  return {
    type: types.GET_TOKEN_LIST,
    payload,
    callback,
  };
}

export function getTokenHolderList(payload: any, callback?: any) {
  return {
    type: types.GET_TOKEN_HOLDER_LIST,
    payload,
    callback,
  };
}

export function getTokenTransactionList(payload: any, callback?: any) {
  return {
    type: types.GET_TOKEN_TRANSACTION_LIST,
    payload,
    callback,
  };
}

export function setTokenHolderList(payload: any) {
  return {
    type: types.SET_TOKEN_HOLDER_LIST,
    payload,
  };
}

export function setTokenTransactionList(payload: any) {
  return {
    type: types.SET_TOKEN_TRANSACTION_LIST,
    payload,
  };
}

export function setTokenList(payload: any) {
  return {
    type: types.SET_TOKEN_LIST,
    payload,
  };
}

export function getTokenListInDelay(payload: any) {
  return {
    type: types.GET_TOKEN_LIST_IN_DELAY,
    payload,
  };
}

export function getTokenHolderListInDelay(payload: any) {
  return {
    type: types.GET_TOKEN_HOLDER_LIST_IN_DELAY,
    payload,
  };
}

export function getTokenTransactionListInDelay(payload: any) {
  return {
    type: types.GET_TOKEN_TRANSACTION_LIST_IN_DELAY,
    payload,
  };
}