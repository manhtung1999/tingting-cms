import ModalLoading from '@/components/ModalLoading';
import { Modal, Typography } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
const { Paragraph } = Typography;

function ModalDetail({ dispatch, currentTrans, setCurrentTrans, withdrawStore }) {
    const { detailTrans } = withdrawStore;

    useEffect(() => {
        if (currentTrans.id) {
            const payload = {
                transactionId: currentTrans.id,
            };
            dispatch({ type: 'WITHDRAW_CARD/getDetailTrans', payload });
        }
    }, [currentTrans, dispatch]);

    const handleClose = () => {
        setCurrentTrans({
            ...currentTrans,
            isShow: false,
        });
    };

    if (!detailTrans) {
        return <ModalLoading />;
    }

    console.log('detailTrans', detailTrans);

    return (
        <Modal
            title={formatMessage({ id: 'DETAIL_TRANSACTION' })}
            visible={currentTrans.isShow}
            wrapClassName={styles.modal}
            onOk={handleClose}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                {detailTrans.historyTransactionCardList?.map((item, index) => {
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
export default connect(({ WITHDRAW_CARD }) => ({
    withdrawStore: WITHDRAW_CARD,
}))(ModalDetail);
