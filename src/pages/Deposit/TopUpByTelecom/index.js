import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { MenhGia } from '../../../config/constant';
import styles from './styles.scss';
import { formatVnd } from '@/util/function';

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};
function TopUpByTelecom({ dispatch, depositStore }) {
    const [form] = Form.useForm();

    const { listPaymentType, loading } = depositStore;

    React.useEffect(() => {
        dispatch({ type: 'DEPOSIT/getPaymentType' });
    }, [dispatch]);

    const handleSubmit = values => {
        const paymentTypeByCard = 5;
        values.paymentType = paymentTypeByCard;
        const payload = { ...values };
        dispatch({ type: 'DEPOSIT/createDeposit', payload });
    };

    const listPaymentTypeByCard = listPaymentType.slice(0, 4);

    return (
        <div className={styles.content}>
            <div className={styles.topup}>
                <h5 className="mb-3">
                    {formatMessage({ id: 'ADD_TRANSACTION_DEPOSIT_BY_TELECOM' })}
                </h5>
                <div className={styles.form}>
                    <Form
                        {...formItemLayout}
                        layout="vertical"
                        form={form}
                        scrollToFirstError
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={formatMessage({ id: 'CHOOSE_CARD_TELELE' })}
                            name="bankId"
                            rules={[{ required: true }]}
                        >
                            <Select style={{ minWidth: 180 }}>
                                {listPaymentTypeByCard.map((item, index) => {
                                    return <Option value={item.id}>{item.sortNameBank}</Option>;
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={formatMessage({ id: 'SERIAL' })}
                            rules={[{ required: true }]}
                            name="serial"
                            whitespace
                        >
                            <Input className={styles.textInput} />
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'TELE_NUMBER' })}
                            rules={[{ required: true }]}
                            name="cardCode"
                            whitespace
                        >
                            <Input className={styles.textInput} />
                        </Form.Item>

                        <Form.Item
                            label={formatMessage({ id: 'CHOOSE_CARD_VALUE' })}
                            name="totalMoney"
                            rules={[{ required: true }]}
                        >
                            <Select style={{ minWidth: 180 }}>
                                {MenhGia.map(i => (
                                    <Option value={i}>{formatVnd(i)}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="p-3 col-6 d-flex justify-content-end">
                            <button
                                disabled={loading}
                                htmlType="submit"
                                className={styles.primaryBtn}
                            >
                                {formatMessage({ id: 'SUBMIT' })}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default connect(({ DEPOSIT }) => ({
    depositStore: DEPOSIT,
}))(TopUpByTelecom);
