import { PaymentTypeValue } from '@/config/constant';
import { Modal } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
function ModalSecret({ dispatch, showSecret, setShowSecret, listSecret }) {
    const handleClose = () => {
        setShowSecret(false);
    };

    return (
        <Modal
            title={formatMessage({ id: 'LIST_SECRET_KEY' })}
            visible={showSecret}
            wrapClassName={styles.modal}
            onOk={handleClose}
            okText={formatMessage({ id: 'OK' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.listSecret}>
                {listSecret.map((item, index) => {
                    return (
                        <div className="mb-2">
                            <span className="me-2">
                                {formatMessage({ id: PaymentTypeValue[item.type] })}:{' '}
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
