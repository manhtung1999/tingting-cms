import { Form, message, Select, Modal } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { MIN_WITHDRAW } from '@/config/constant';
import AddRecipient from './AddRecipient';
import styles from './styles.scss';
import ic_delete from '@/assets/image/ic_delete.svg';
const { Option } = Select;
function AddWithdraw({ dispatch, withdrawStore }) {
    const { listCardBank, addCardResponse, listPaymentType, deleteCardResponse } = withdrawStore;
    const [form] = Form.useForm();
    const [amountDeposit, setAmountDeposit] = React.useState();

    useEffect(() => {
        dispatch({ type: 'WITHDRAW/getCardBank' });
    }, [dispatch, addCardResponse, deleteCardResponse]);

    useEffect(() => {
        dispatch({ type: 'WITHDRAW/getPaymentType' });
    }, [dispatch]);

    const handleSubmit = values => {
        const accReceipt = listCardBank.find(item => item.id === values.userCardBankId);
        if (amountDeposit <= 0) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        if (accReceipt.bankName === 'ZaloPay' && amountDeposit < 20000) {
            message.error(formatMessage({ id: 'MIN_ZALOPAY_20K' }));
            return;
        }
        if (amountDeposit < MIN_WITHDRAW) {
            message.error(formatMessage({ id: 'MIN_WITHDRAW_10000' }));
            return;
        }
        const payload = {
            ...values,
            totalMoney: amountDeposit,
        };
        dispatch({ type: 'WITHDRAW/createWithdraw', payload });
    };

    const handleChange = e => {
        setAmountDeposit(Number(e.currentTarget.rawValue));
    };

    const arrayUniqueByBankName = listPaymentType.filter(paymentType =>
        paymentType.fullNameBank.includes('System-'),
    );
    console.log({ arrayUniqueByBankName });

    const handleDelete = (e, cardId) => {
        e.stopPropagation();
        const payload = {
            id: cardId,
        };
        Modal.confirm({
            title: formatMessage({ id: 'CONFIRM' }),
            content: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_DEVICE' }),
            okText: formatMessage({ id: 'OK' }),
            cancelText: formatMessage({ id: 'CANCEL' }),
            onOk: () => {
                dispatch({ type: 'WITHDRAW/deleteCardBank', payload });
            },
        });
    };

    return (
        <div className={styles.addWithdraw}>
            <h5 className="mb-3">{formatMessage({ id: 'ADD_WITHDRAW_REQUEST' })}</h5>

            <AddRecipient />

            <div className={styles.form}>
                <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    scrollToFirstError
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="userCardBankId"
                        label={formatMessage({ id: 'ACCOUNT_IN' })}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select style={{ minWidth: 180 }}>
                            {listCardBank.map((item, index) => {
                                return (
                                    <Option key={index} value={item.id}>
                                        <div className="d-inline-flex justify-content-between">
                                            <div>
                                                <span>{item.bankName}</span>
                                                <span className="mx-2">-</span>
                                                <span>{item.numberAccount}</span>
                                                <span className="mx-2">-</span>
                                                <span>{item.username}</span>
                                            </div>
                                            <img
                                                src={ic_delete}
                                                style={{ width: 20, height: 20, marginLeft: 50 }}
                                                alt=""
                                                onClick={e => handleDelete(e, item.id)}
                                            />
                                        </div>
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'TRANSFER_ACC' })}
                        name="bankId"
                        rules={[{ required: true }]}
                    >
                        <Select style={{ minWidth: 180 }}>
                            {arrayUniqueByBankName
                                .filter(i => i.sortNameBank !== 'USDT')
                                .map((item, index) => {
                                    return (
                                        <Option value={item.id}>
                                            {item.sortNameBank} - {item.fullNameBank}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'AMOUNT' })}
                        name="totalMoney"
                        rules={[{ required: true }]}
                    >
                        <Cleave
                            className={styles.textInput}
                            placeholder="0"
                            onChange={handleChange}
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: 'thousand',
                            }}
                        />
                    </Form.Item>
                    <div className="p-3 col-5 d-flex justify-content-end">
                        <button htmlType="submit" className={styles.primaryBtn}>
                            {formatMessage({ id: 'SUBMIT' })}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default connect(({ WITHDRAW }) => ({
    withdrawStore: WITHDRAW,
}))(AddWithdraw);
