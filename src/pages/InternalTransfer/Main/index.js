import { connect } from 'dva';
import React from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import AddWithdraw from '../AddWithdraw';
import ListWithdraw from '../ListWithdraw';
import styles from './styles.scss';

function Withdraw(props) {
    const { location } = props;

    const renderComponent = () => {
        if (location.query.tab === 'tranfer-balance') {
            return <AddWithdraw />;
        } else if (
            location.query.tab === 'list-internal-transfer' ||
            location.query.tab === undefined
        ) {
            return <ListWithdraw />;
        }
    };

    return (
        <>
            <div className={styles.tabs}>
                <button
                    className={
                        location.query.tab === 'list-internal-transfer' ||
                        location.query.tab === undefined
                            ? `${styles.active}`
                            : undefined
                    }
                    onClick={() =>
                        router.push('/home/internal-transfer?tab=list-internal-transfer')
                    }
                >
                    {formatMessage({ id: 'INTERNAL_TRANSFER_LIST' })}
                </button>
                <button
                    className={
                        location.query.tab === 'tranfer-balance' ? `${styles.active}` : undefined
                    }
                    onClick={() => router.push('/home/internal-transfer?tab=tranfer-balance')}
                >
                    {formatMessage({ id: 'ADD_INTERNAL_TRANSFER' })}
                </button>
            </div>
            {renderComponent()}
        </>
    );
}

export default connect(({ DASHBOARD }) => ({
    dashboardStore: DASHBOARD,
}))(withRouter(Withdraw));
