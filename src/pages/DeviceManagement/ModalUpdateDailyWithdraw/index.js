import { message, Modal } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function ModalUpdateDailyWithdraw({ dispatch, currentWithdraw, setCurrentWithdraw }) {
    const [limitWithdraw, setLimitWithdraw] = useState(currentWithdraw.dailyWithdrawMoney);

    const handleClose = () => {
        setCurrentWithdraw({
            ...currentWithdraw,
            showWithdraw: false,
        });
    };

    const handleSubmit = () => {
        if (!limitWithdraw) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const payload = {
            id: currentWithdraw.id,
            dailyWithdrawMoney: limitWithdraw,
        };
        dispatch({ type: 'DEVICE/updateStatus', payload });
        handleClose();
    };

    const handleChange = e => {
        setLimitWithdraw(e.currentTarget.rawValue);
    };

    return (
        <Modal
            title={formatMessage({ id: 'UPDATE_WITHDRAWAL_DAILY_LIMIT' })}
            visible={currentWithdraw.showWithdraw}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <Cleave
                    defaultValue={limitWithdraw}
                    className={styles.textInputLight}
                    placeholder="0"
                    onChange={handleChange}
                    value={limitWithdraw}
                    options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                    }}
                />
            </div>
        </Modal>
    );
}
export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(ModalUpdateDailyWithdraw);
