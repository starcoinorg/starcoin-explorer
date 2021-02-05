import * as types from './constants';

export function searchKeyword(payload: any, callback?: any) {
  return {
    type: types.SEARCH_KEYWORD,
    payload,
    callback
  };
}
