import * as types from './constants';

const initState = {
  block: null,
  blockList: null,
  isLoadingMore: false,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_BLOCK: {
      return { ...state, block: action.payload };
    }
    case types.SET_BLOCK_LIST: {
      return { ...state, blockList: action.payload };
    }
    case types.GET_BLOCK_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_BLOCK_LIST_SUCCESS:
    case types.GET_BLOCK_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    default:
      return state;
  }
}