import { PaymentTypeValueAll } from '@/config/constant';
import { Modal } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
function ModalSecret({ dispatch, currentUserSecret, setCurrentUserSecret, listSecret }) {
    const handleClose = () => {
        setCurrentUserSecret({
            ...currentUserSecret,
            isShow: false,
        });
    };

    const handleUpdateCardSecret = () => {
        const typeCard = 5;
        const payload = {
            ownerId: currentUserSecret.id,
            type: typeCard,
        };
        dispatch({ type: 'ACCOUNT/updateCardSecret', payload });
    };

    return (
        <Modal
            title={formatMessage({ id: 'LIST_SECRET_KEY' })}
            visible={currentUserSecret.isShow}
            wrapClassName={styles.modal}
            onOk={handleClose}
            okText={formatMessage({ id: 'OK' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.listSecret}>
                <div className="d-flex justify-content-end">
                    <button onClick={handleUpdateCardSecret} className={styles.primaryBtn}>
                        {formatMessage({ id: 'UPDATE_CARD_SECRET_KEY' })}
                    </button>
                </div>

                {listSecret.map((item, index) => {
                    return (
                        <div className="mb-2">
                            <span className="me-2">
                                {formatMessage({ id: PaymentTypeValueAll[item.type] })}:{' '}
                            </span>

                            <span>{item.secretKey}</span>
                            <span className="ms-2">(ID: {item.id} )</span>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}
export default connect(({ ACCOUNT }) => ({
    accountStore: ACCOUNT,
}))(ModalSecret);
