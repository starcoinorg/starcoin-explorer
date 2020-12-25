import React, { PureComponent } from 'react';
import BaseRouteLink from "../../../../common/BaseRouteLink";

class Index extends PureComponent {
    render() {
        return (
            <React.Fragment>
                <div>
                    Transactions List
                    <BaseRouteLink to="/transactions/detail/asdfasdf">Detail</BaseRouteLink>
                </div>
            </React.Fragment>
        );
    }
}

export default Index;