import * as types from './constants';

export function getBlock(payload: any) {
  return {
    type: types.GET_BLOCK,
    payload
  };
}

export function setBlock(payload: any) {
  return {
    type: types.SET_BLOCK,
    payload
  };
}

export function getBlockByHeight(payload: any) {
  return {
    type: types.GET_BLOCK_BY_HEIGHT,
    payload
  };
}

export function getBlockList(payload: any, callback?: any) {
  return {
    type: types.GET_BLOCK_LIST,
    payload,
    callback
  };
}

export function setBlockList(payload: any) {
  return {
    type: types.SET_BLOCK_LIST,
    payload
  };
}
