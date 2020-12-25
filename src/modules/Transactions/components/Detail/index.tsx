import React, { PureComponent } from 'react';
import BaseRouteLink from "../../../../common/BaseRouteLink";

class Index extends PureComponent {
    render() {
        return (
            <React.Fragment>
                <div>
                  Transactions Detail
                  <br /><br />
                  <BaseRouteLink to="../">List</BaseRouteLink>
                </div>
            </React.Fragment>
        );
    }
}

export default Index;