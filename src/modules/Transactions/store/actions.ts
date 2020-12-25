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
