import { connect } from 'dva';
import React from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import TopUp from '../TopUp';
import AddWithdraw from '../AddWithdraw';
import USDTPaymentRate from '../USDTPaymentRate';
import styles from './styles.scss';

function Admin(props) {
    const { location } = props;

    const renderComponent = () => {
        if (location.query.tab === 'usdt-rate') {
            return <USDTPaymentRate />;
        } else if (location.query.tab === 'add-trans-deposit' || location.query.tab === undefined) {
            return <TopUp />;
        } else if (location.query.tab === 'add-trans-withdraw') {
            return <AddWithdraw />;
        }
    };

    return (
        <>
            <div className={styles.tabs}>
                <button
                    className={
                        location.query.tab === 'add-trans-deposit' ||
                        location.query.tab === undefined
                            ? `${styles.active}`
                            : undefined
                    }
                    onClick={() => router.push('/home/admin?tab=add-trans-deposit')}
                >
                    {formatMessage({ id: 'ADD_TRANSACTION_DEPOSIT' })}
                </button>
                <button
                    className={
                        location.query.tab === 'add-trans-withdraw' ? `${styles.active}` : undefined
                    }
                    onClick={() => router.push('/home/admin?tab=add-trans-withdraw')}
                >
                    {formatMessage({ id: 'ADD_TRANSACTION_WITHDRAW' })}
                </button>
                <button
                    className={location.query.tab === 'usdt-rate' ? `${styles.active}` : undefined}
                    onClick={() => router.push('/home/admin?tab=usdt-rate')}
                >
                    {formatMessage({ id: 'USDT_PAYMENT_RATE' })}
                </button>
            </div>
            <div className={styles.content}>{renderComponent()}</div>
        </>
    );
}

export default connect(({ DASHBOARD }) => ({
    dashboardStore: DASHBOARD,
}))(withRouter(Admin));
