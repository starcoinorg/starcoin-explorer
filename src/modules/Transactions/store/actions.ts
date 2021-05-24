import * as types from './constants';

export function getTransaction(payload: any) {
  return {
    type: types.GET_TRANSACTION,
    payload
  };
}

export function setTransaction(payload: any) {
  return {
    type: types.SET_TRANSACTION,
    payload
  };
}

export function getTransactionList(payload: any, callback?: any) {
  return {
    type: types.GET_TRANSACTION_LIST,
    payload,
    callback
  };
}

export function setTransactionList(payload: any) {
  return {
    type: types.SET_TRANSACTION_LIST,
    payload
  };
}

export function getAddressTransactions(payload: any, callback?: any) {
  return {
    type: types.GET_ADDRESS_TRANSACTIONS,
    payload,
    callback
  };
}

export function setAddressTransactions(payload: any) {
  return {
    type: types.SET_ADDRESS_TRANSACTIONS,
    payload
  };
}


export function getBlockTransactions(payload: any, callback?: any) {
  return {
    type: types.GET_BLOCK_TRANSACTIONS,
    payload,
    callback
  };
}

export function setBlockTransactions(payload: any) {
  return {
    type: types.SET_BLOCK_TRANSACTIONS,
    payload
  };
}

export function getBlockTransactionsByHeight(payload: any, callback?: any) {
  return {
    type: types.GET_BLOCK_TRANSACTIONS_BY_HEIGHT,
    payload,
    callback
  };
}

export function getTransactionListInDelay(payload: any) {
  return {
    type : types.GET_TRANSACTION_LIST_IN_DELAY,
    payload
  }
}