import { connect } from 'dva';
import React from 'react';
import { withRouter } from 'umi';
import ListWithdraw from '../ListWithdraw';

function WithdrawHistoryCard(props) {
    return <ListWithdraw />;
}

export default connect(({ WITHDRAW_CARD }) => ({
    dashboardStore: WITHDRAW_CARD,
}))(withRouter(WithdrawHistoryCard));
