import { MenhGia } from '@/config/constant';
import { formatVnd } from '@/util/function';
import { Form, message, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';
import ModalDetal from '../ModalDetal';

const { Option } = Select;
function AddWithdrawByTelecom({ dispatch, withdrawStore }) {
    const { listPaymentType, loading, withdrawTelecom } = withdrawStore;

    const [form] = Form.useForm();

    useEffect(() => {
        dispatch({ type: 'WITHDRAW/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {}, []);

    const handleSubmit = values => {
        if (Number(values.qty) > 100) {
            message.warn(formatMessage({ id: 'MAX_QUANTITY_CARD_WITHDRAW_100' }));
            return;
        }
        const TypeCard = 5;
        const payload = {
            ...values,
            totalMoney: Number(values.cardValue) * Number(values.qty),
            paymentType: TypeCard,
            qty: Number(values.qty),
        };
        dispatch({ type: 'WITHDRAW/createWithdraw', payload });
    };

    const listPaymentTypeByCard = listPaymentType.slice(0, 4);
    console.log('withdrawTelecom in page', withdrawTelecom);
    return (
        <div className={styles.addWithdraw}>
            {loading && <ModalLoading />}
            {withdrawTelecom && <ModalDetal />}
            <h5 className="mb-3">{formatMessage({ id: 'ADD_TRANSACTION_WITHDRAW_BY_TELECOM' })}</h5>

            <div className={styles.form}>
                <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    scrollToFirstError
                    onFinish={handleSubmit}
                >
                    {/* Chon nha mang */}
                    <Form.Item
                        label={formatMessage({ id: 'CHOOSE_CARD_TELELE' })}
                        name="bankId"
                        rules={[{ required: true }]}
                    >
                        <Select style={{ minWidth: 180 }}>
                            {listPaymentTypeByCard.map((item, index) => {
                                return (
                                    <Option key={index} value={item.id}>
                                        {item.sortNameBank}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    {/* Chon menh gia */}
                    <Form.Item
                        label={formatMessage({ id: 'CHOOSE_CARD_VALUE' })}
                        name="cardValue"
                        rules={[{ required: true }]}
                    >
                        <Select style={{ minWidth: 180 }}>
                            {MenhGia.map(item => (
                                <Option key={item} value={item}>
                                    {formatVnd(item)}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={formatMessage({ id: 'QUANTITY' })}
                        name="qty"
                        rules={[{ required: true }]}
                    >
                        <Cleave
                            className={styles.textInput}
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: 'thousand',
                            }}
                        />
                    </Form.Item>

                    <div className="p-3 col-5 d-flex justify-content-end">
                        <button disabled={loading} htmlType="submit" className={styles.primaryBtn}>
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
}))(AddWithdrawByTelecom);
