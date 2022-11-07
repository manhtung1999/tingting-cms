import { connect } from 'dva';
import React from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ListWithdraw from '../ListWithdraw';
import Settlement from '../Settlement';
import AddWithdraw from '../AddWithdraw';
import styles from './styles.scss';
import { useLocalStorage } from '@/hooks/index';
import { ADMIN_KEY, Role } from '@/config/constant';

function Withdraw(props) {
    const { location } = props;

    const renderComponent = () => {
        if (location.query.tab === 'add-withdraw') {
            return <AddWithdraw />;
        } else if (location.query.tab === 'list-withdraw' || location.query.tab === undefined) {
            return <ListWithdraw />;
        } else if (location.query.tab === 'settlement') {
            return <Settlement />;
        }
    };

    const [admin] = useLocalStorage(ADMIN_KEY);

    return (
        <>
            {(admin?.role === Role.ROLE_USER || admin?.role === Role.ROLE_AGENT) && (
                <div className={styles.tabs}>
                    <button
                        className={
                            location.query.tab === 'list-withdraw' ||
                            location.query.tab === undefined
                                ? `${styles.active}`
                                : undefined
                        }
                        onClick={() => router.push('/home/withdraw?tab=list-withdraw')}
                    >
                        {formatMessage({ id: 'WITHDRAW_LIST' })}
                    </button>

                    <button
                        className={
                            location.query.tab === 'add-withdraw' ? `${styles.active}` : undefined
                        }
                        onClick={() => router.push('/home/withdraw?tab=add-withdraw')}
                    >
                        {formatMessage({ id: 'ADD_WITHDRAW_REQUEST' })}
                    </button>
                </div>
            )}
            {renderComponent()}
        </>
    );
}

export default connect(({ DASHBOARD }) => ({
    dashboardStore: DASHBOARD,
}))(withRouter(Withdraw));
