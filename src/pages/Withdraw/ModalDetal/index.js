import { Modal, Typography } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
const { Paragraph } = Typography;

function ModalDetail({ dispatch, withdrawStore }) {
    const { withdrawTelecom } = withdrawStore;

    const handleClose = () => {
        dispatch({ type: 'WITHDRAW/closeModalDetail' });
    };

    console.log('withdrawTelecom', withdrawTelecom);

    if (!withdrawTelecom || !withdrawTelecom?.historyTransactionCardList) {
        return null;
    }

    return (
        <Modal
            title={formatMessage({ id: 'DETAIL_TRANSACTION' })}
            visible={!!withdrawTelecom}
            wrapClassName={styles.modal}
            onOk={handleClose}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                {withdrawTelecom.historyTransactionCardList?.map((item, index) => {
                    return (
                        <>
                            <h2>Card {index + 1}:</h2>
                            <Paragraph>
                                {formatMessage({ id: 'TYPE' })}: {item.nameSystemCard}
                            </Paragraph>
                            <Paragraph copyable={{ text: item.code }}>
                                {formatMessage({ id: 'TELE_NUMBER' })}: {item.code}
                            </Paragraph>
                            <Paragraph copyable={{ text: item.serial }}>
                                {formatMessage({ id: 'SERIAL' })}: {item.serial}
                            </Paragraph>
                            <Paragraph>
                                {formatMessage({ id: 'STATUS' })}: {item.status}
                            </Paragraph>
                        </>
                    );
                })}
            </div>
        </Modal>
    );
}
export default connect(({ WITHDRAW }) => ({
    withdrawStore: WITHDRAW,
}))(ModalDetail);
