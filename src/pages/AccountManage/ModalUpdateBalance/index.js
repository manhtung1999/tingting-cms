import { Modal, Input, message } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';

function ModalUpdateBalance({ dispatch, id, currentMoney }) {
    const [isShow, setIsShow] = useState(false);

    const [totalMoney, setTotalMoney] = useState();
    const [reason, setReason] = useState();

    const handleUpdate = () => {
        if (totalMoney === undefined || totalMoney < 0 || !reason || reason?.trim() === '') {
            message.warn(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }

        const payload = {
            id: id,
            totalMoney,
            reason,
        };
        dispatch({ type: 'ACCOUNT/updateUser', payload });
        setIsShow(false);
    };

    const handleChangeBalance = e => {
        setTotalMoney(Number(e.currentTarget.rawValue));
    };

    return (
        <>
            <div>
                <button className={styles.smallPrimaryBtn} onClick={() => setIsShow(true)}>
                    {formatMessage({ id: 'UPDATE_BALANCE' })}
                </button>
            </div>
            <Modal
                title={formatMessage({ id: 'UPDATE_BALANCE' })}
                visible={isShow}
                wrapClassName={styles.modal}
                onOk={handleUpdate}
                okText={formatMessage({ id: 'OK' })}
                onCancel={() => setIsShow(false)}
                destroyOnClose
            >
                <div className={styles.listSecret}>
                    <div className="mb-4">
                        <span className="mb-2 d-block">{formatMessage({ id: 'BALANCE' })}:</span>
                        <Cleave
                            value={currentMoney}
                            className={styles.textInputLight}
                            onChange={e => handleChangeBalance(e)}
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: 'thousand',
                            }}
                        />
                    </div>
                    <div>
                        <span style={{ color: '#000' }}>{formatMessage({ id: 'REASON' })}:</span>
                        <Input onChange={e => setReason(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default connect(({ ACCOUNT }) => ({
    accountStore: ACCOUNT,
}))(ModalUpdateBalance);
