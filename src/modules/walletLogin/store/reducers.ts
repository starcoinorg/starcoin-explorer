import * as types from './constants';

const initState = {
  accounts:[],
  balances:null,
  connectState:null,
  signResult:'',
  stcProvider:null,
  chainId:'0x1',
  userInfo:{}
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_ACCOUNTS: {
      return { ...state, accounts: action.payload };
    }
    case types.SET_BALANCE: {
      return { ...state, balances: action.payload };
    }
    case types.SET_SIGNRESULT: {
      return { ...state, signResult: action.payload };
    }
    case types.SET_STATE: {
      return { ...state, connectState: action.payload };
    }
    case types.SET_PROVIDER: {
      return { ...state, stcProvider: action.payload };
    }
    case types.SET_USERINFO_DATA: {
      return { ...state, userInfo: {...state.userInfo,...action.payload} };
    }
    default:
      return state;
  }
}