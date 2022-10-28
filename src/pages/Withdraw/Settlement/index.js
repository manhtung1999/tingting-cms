import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import { formatMessage } from 'umi-plugin-react/locale';
import AddSettlement from './AddSettlement';
import SettlementManagement from './SettlementManagement';

export default function Settlement() {
    const [isAdd, setIsAdd] = useState(true);

    useEffect(() => {}, []);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'SETTLEMENT_APPLICATION' })}</h3>
                </div>
            </div>
            <div className={styles.tabs}>
                <button
                    className={isAdd ? `${styles.active}` : undefined}
                    onClick={() => setIsAdd(true)}
                >
                    {formatMessage({ id: 'ADD_SETTLEMENT' })}
                </button>
                <button
                    className={!isAdd ? `${styles.active}` : undefined}
                    onClick={() => setIsAdd(false)}
                >
                    {formatMessage({ id: 'SETTLEMENT_ACCOUNT_MANAGEMENT' })}
                </button>
            </div>
            <div className={styles.content}>
                {isAdd ? <AddSettlement /> : <SettlementManagement />}
            </div>
        </div>
    );
}
