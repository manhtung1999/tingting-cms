import { Role, RoleName } from '@/config/constant';
import { formatVnd } from '@/util/function';
import { Form, Select, message } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { MenhGia } from '../../../config/constant';
import styles from './styles.scss';
import Cleave from 'cleave.js/react';
import ModalLoading from '@/components/ModalLoading';

const { Option } = Select;
function AddWithdrawByTelecom({ dispatch, adminStore }) {
    const { listMerchant, listPaymentType, loading } = adminStore;
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch({ type: 'ADMIN/getPaymentType' });
    }, [dispatch]);

    // get merchant list
    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_USER],
        };
        dispatch({ type: 'ADMIN/getMerchants', payload });
    }, [dispatch]);

    const handleSubmit = values => {
        if (Number(values.qty) > 100) {
            message.warn(formatMessage({ id: 'MAX_QUANTITY_CARD_WITHDRAW_100' }));
            return;
        }
        const TypeCard = 5;
        const payload = {
            ...values,
            totalMoney: values.cardValue,
            paymentType: TypeCard,
            qty: Number(values.qty),
        };
        dispatch({ type: 'ADMIN/createWithdraw', payload });
    };

    const listPaymentTypeByCard = listPaymentType.slice(0, 4);

    return (
        <div className={styles.addWithdraw}>
            <h5 className="mb-3">{formatMessage({ id: 'ADD_TRANSACTION_WITHDRAW_BY_TELECOM' })}</h5>
            {loading && <ModalLoading />}

            <div className={styles.form}>
                <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    scrollToFirstError
                    onFinish={handleSubmit}
                >
                    {/* Chon khach hang */}
                    <Form.Item
                        label={formatMessage({ id: 'MERCHANT' })}
                        name="ownerId"
                        rules={[{ required: true }]}
                    >
                        <Select style={{ minWidth: 180 }}>
                            {listMerchant.map(item => {
                                return <Option value={item.id}>{item.phone}</Option>;
                            })}
                        </Select>
                    </Form.Item>

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

                    {/* Chon so luong the */}
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

export default connect(({ ADMIN }) => ({
    adminStore: ADMIN,
}))(AddWithdrawByTelecom);
