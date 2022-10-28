import React from 'react';
import { withRouter } from 'umi';
import ListTransaction from '../ListTransaction';

function Transaction(props) {
    return (
        <>
            <ListTransaction />;
        </>
    );
}

export default withRouter(Transaction);
