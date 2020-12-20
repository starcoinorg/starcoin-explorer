export function pushLocation(params: any, abs = false) {
  return {
    type: 'PUSH_LOCATION',
    params: {
      path: params,
      abs
    }
  };
}

export function goBack() {
  return {
    type: 'GO_BACK'
  };
}
