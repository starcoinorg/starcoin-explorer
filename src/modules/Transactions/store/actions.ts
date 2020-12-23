import * as types from './constants';

export function getTransaction() {
  return {
    type: types.GET_TRANSACTION
  };
}

export function setTransaction(payload: any) {
  return {
    type: types.SET_TRANSACTION,
    payload
  };
}
