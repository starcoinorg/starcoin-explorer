import * as types from './constants';

const initState = {
  block: null,
  blockList: null,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_BLOCK: {
      return { ...state, block: action.payload };
    }
    case types.SET_BLOCK_LIST: {
      return { ...state, blockList: action.payload };
    }
    default:
      return state;
  }
}