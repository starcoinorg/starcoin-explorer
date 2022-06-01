import React from "react";
import { NavigateFunction, useLocation, useNavigate, useParams } from "react-router";

export interface RoutedProps<Params = any, State = any> {
  location: State;
  navigate: NavigateFunction;
  params: Params;
}


export function withRouter<P extends RoutedProps>( Child: React.ComponentClass<P> ) {
  return ( props: Omit<P, keyof RoutedProps> ) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Child { ...props as P } navigate={ navigate } location={ location } params={ params }/>;
  }
}
