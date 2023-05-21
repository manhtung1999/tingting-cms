import { Input, Modal, message } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function ModalOtp({ dispatch, masterDataStore, showOtp, setShowOtp }) {
    const { mailResponse } = masterDataStore;
    const [otp, setOtp] = useState();

    const handleClose = () => {
        setShowOtp(false);
    };

    const handleConfirm = () => {
        if (!otp) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
        } else {
            const payload = {
                code: otp,
                phone: mailResponse?.phone,
            };
            dispatch({ type: 'MASTERDATA/verifyOtp', payload });
        }
    };

    const _handleKeyDown = e => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    return (
        <Modal
            title={formatMessage({ id: 'CONFIRM_OTP_FROM_EMAIL' })}
            visible={showOtp}
            wrapClassName={styles.modal}
            onOk={handleConfirm}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.listSecret}>
                <Input
                    onKeyPress={_handleKeyDown}
                    className={styles.textInputLight}
                    onChange={e => setOtp(e.target.value)}
                ></Input>
            </div>
        </Modal>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(ModalOtp);
