import { message, Modal, Input } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function ModalConfirm({ dispatch, modalConfirm, setModalConfirm }) {
    const [currentMoney, setCurrentMoney] = useState();

    const handleClose = () => {
        setModalConfirm({
            isShow: false,
            id: undefined,
        });
    };

    const handleSubmit = () => {
        if (!currentMoney) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const payload = {
            id: modalConfirm.id,
            currentMoney,
        };
        dispatch({ type: 'DEPOSIT/confirmDeposit', payload });
        handleClose();
    };

    const handleChange = e => {
        setCurrentMoney(Number(e.currentTarget.rawValue));
    };
    return (
        <Modal
            title={formatMessage({ id: 'CONFIRM_DEPOSIT_REQUEST' })}
            visible={modalConfirm.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <span className="me-2">{formatMessage({ id: 'AMOUNT' })}: </span>
                <Cleave
                    value={currentMoney}
                    className={styles.textInputLight}
                    onChange={handleChange}
                    options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                    }}
                />
                <div>
                    <span className="me-2">{formatMessage({ id: 'REASON' })}: </span>
                    <Input />
                </div>
            </div>
        </Modal>
    );
}
export default connect(({ DEPOSIT }) => ({
    depositStore: DEPOSIT,
}))(ModalConfirm);
