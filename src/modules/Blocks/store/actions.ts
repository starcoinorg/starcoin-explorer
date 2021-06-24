import * as types from './constants';

export function getBlock(payload: any) {
  return {
    type: types.GET_BLOCK,
    payload
  };
}

export function getUncleBlock(payload: any) {
  return {
    type: types.GET_UNCLE_BLOCK,
    payload
  };
}

export function setBlock(payload: any) {
  return {
    type: types.SET_BLOCK,
    payload
  };
}

export function setUncleBlock(payload: any) {
  return {
    type: types.SET_UNCLE_BLOCK,
    payload
  };
}

export function getBlockByHeight(payload: any) {
  return {
    type: types.GET_BLOCK_BY_HEIGHT,
    payload
  };
}

export function getUncleBlockByHeight(payload: any) {
  return {
    type: types.GET_UNCLE_BLOCK_BY_HEIGHT,
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

export function getUncleBlockList(payload: any, callback?: any) {
  return {
    type: types.GET_UNCLE_BLOCK_LIST,
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

export function setUncleBlockList(payload: any) {
  return {
    type: types.SET_UNCLE_BLOCK_LIST,
    payload
  };
}

export function getBlockListInDelay(payload: any) {
  return {
    type: types.GET_BLOCK_LIST_IN_DELAY,
    payload
  };
}

export function getUncleBlockListInDelay(payload: any) {
  return {
    type: types.GET_UNCLE_BLOCK_LIST_IN_DELAY,
    payload
  };
}
