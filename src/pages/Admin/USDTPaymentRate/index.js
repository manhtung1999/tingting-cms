import React, { useEffect } from 'react';
import styles from './styles.scss';
import { formatMessage } from 'umi-plugin-react/locale';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import { message } from 'antd';

function USDTPaymentRate({ adminStore, dispatch }) {
    const { listPaymentType } = adminStore;
    const [amountDeposit, setAmountDeposit] = React.useState();
    const [currentExchange, setCurrentExchange] = React.useState();

    useEffect(() => {
        dispatch({ type: 'ADMIN/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        if (listPaymentType.length > 0) {
            const usdt = listPaymentType.find(i => i.sortNameBank === 'USDT');
            if (!usdt) {
                message.error(formatMessage({ id: 'DONT_HAVE_USDT' }));
                return;
            } else {
                setCurrentExchange(usdt.exchangeRate);
            }
        }
    }, [listPaymentType]);

    const handleSubmit = () => {
        if (!listPaymentType.find(i => i.sortNameBank === 'USDT')) {
            message.error(formatMessage({ id: 'DONT_HAVE_USDT' }));
            return;
        }
        const payload = {
            id: listPaymentType.find(i => i.sortNameBank === 'USDT').id,
            exchangeRate: amountDeposit,
        };
        dispatch({ type: 'ADMIN/configUSDT', payload });
    };

    const handleChange = e => {
        setAmountDeposit(Number(e.currentTarget.rawValue));
    };

    return (
        <div className={styles.topup}>
            <h5 className="mb-5">{formatMessage({ id: 'USDT_PAYMENT_RATE' })}</h5>
            <div className={styles.form}>
                <div className="d-flex col-6 justify-content-between align-items-center">
                    <div>1 USDT</div>
                    <span className="mx-5">=</span>
                    <div className="flex-grow-1 d-flex align-items-center">
                        <Cleave
                            className={styles.textInput}
                            placeholder={formatMessage({ id: 'AMOUNT_IN_VND' })}
                            onChange={handleChange}
                            value={currentExchange}
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: 'thousand',
                            }}
                        />
                        <span className="ms-3">VNĐ</span>
                    </div>
                </div>

                <div className="mt-4 p-3 col-6 d-flex justify-content-end">
                    <button onClick={handleSubmit} className={styles.primaryBtn}>
                        {formatMessage({ id: 'SUBMIT' })}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default connect(({ ADMIN }) => ({
    adminStore: ADMIN,
}))(USDTPaymentRate);
