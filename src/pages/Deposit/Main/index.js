import React from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ListDeposit from '../ListDeposit';
import TopUp from '../TopUp';
import AddUSDT from '../AddUSDT';
import styles from './styles.scss';
import { useLocalStorage } from '@/hooks/index';
import { ADMIN_KEY, Role } from '@/config/constant';
import TopUpByTelecom from '../TopUpByTelecom';

function Deposit(props) {
    const { location } = props;

    const renderComponent = () => {
        if (location.query.tab === 'topup') {
            return <TopUp />;
        } else if (location.query.tab === 'list-deposit' || location.query.tab === undefined) {
            return <ListDeposit />;
        } else if (location.query.tab === 'add-usdt') {
            return <AddUSDT />;
        } else if (location.query.tab === 'add-trans-deposit-by-telecom') {
            return <TopUpByTelecom />;
        }
    };

    const [admin] = useLocalStorage(ADMIN_KEY);

    return (
        <>
            {admin?.role === Role.ROLE_USER && (
                <div className={styles.tabs}>
                    <button
                        className={
                            location.query.tab === 'list-deposit' ||
                            location.query.tab === undefined
                                ? `${styles.active}`
                                : undefined
                        }
                        onClick={() => router.push('/home/deposit?tab=list-deposit')}
                    >
                        {formatMessage({ id: 'DEPOSIT_LIST' })}
                    </button>
                    <button
                        className={location.query.tab === 'topup' ? `${styles.active}` : undefined}
                        onClick={() => router.push('/home/deposit?tab=topup')}
                    >
                        {formatMessage({ id: 'TOPUP' })}
                    </button>
                    <button
                        className={
                            location.query.tab === 'add-usdt' ? `${styles.active}` : undefined
                        }
                        onClick={() => router.push('/home/deposit?tab=add-usdt')}
                    >
                        {formatMessage({ id: 'ADD_USDT_DEPOSIT' })}
                    </button>
                    <button
                        className={
                            location.query.tab === 'add-trans-deposit-by-telecom'
                                ? `${styles.active}`
                                : undefined
                        }
                        onClick={() =>
                            router.push('/home/deposit?tab=add-trans-deposit-by-telecom')
                        }
                    >
                        {formatMessage({ id: 'ADD_TRANSACTION_DEPOSIT_BY_TELECOM' })}
                    </button>
                </div>
            )}

            {/* admin xem danh sachh deposit va them giao dịch usdt */}
            {admin?.role === Role.ROLE_ADMIN && (
                <div className={styles.tabs}>
                    <button
                        className={
                            location.query.tab === 'list-deposit' ||
                            location.query.tab === undefined
                                ? `${styles.active}`
                                : undefined
                        }
                        onClick={() => router.push('/home/deposit?tab=list-deposit')}
                    >
                        {formatMessage({ id: 'DEPOSIT_LIST' })}
                    </button>

                    <button
                        className={
                            location.query.tab === 'add-usdt' ? `${styles.active}` : undefined
                        }
                        onClick={() => router.push('/home/deposit?tab=add-usdt')}
                    >
                        {formatMessage({ id: 'ADD_USDT_DEPOSIT' })}
                    </button>
                </div>
            )}
            {renderComponent()}
        </>
    );
}

export default withRouter(Deposit);
