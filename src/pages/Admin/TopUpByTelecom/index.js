import { Role, RoleName } from '@/config/constant';
import { formatVnd } from '@/util/function';
import { Form, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { MenhGia } from '../../../config/constant';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';

const { Option } = Select;
function TopUpByTelecom({ dispatch, adminStore }) {
    const { listMerchant, listPaymentType, loading } = adminStore;
    const [form] = Form.useForm();

    // get merchant list
    useEffect(() => {
        const payload = {
            role: RoleName[Role.ROLE_USER],
        };
        dispatch({ type: 'ADMIN/getMerchants', payload });
    }, [dispatch]);

    React.useEffect(() => {
        dispatch({ type: 'ADMIN/getPaymentType' });
    }, [dispatch]);

    const handleSubmit = values => {
        const paymentTypeByCard = 5;
        values.paymentType = paymentTypeByCard;
        const payload = { ...values };
        dispatch({ type: 'ADMIN/createDeposit', payload });
    };

    const listPaymentTypeByCard = listPaymentType.slice(0, 4);

    return (
        <div className={styles.addWithdraw}>
            <h5 className="mb-3">{formatMessage({ id: 'ADD_TRANSACTION_DEPOSIT_BY_TELECOM' })}</h5>
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
                                return <Option value={item.id}>{item.sortNameBank}</Option>;
                            })}
                        </Select>
                    </Form.Item>

                    {/* Chon menh gia */}
                    <Form.Item
                        label={formatMessage({ id: 'CHOOSE_CARD_VALUE' })}
                        name="totalMoney"
                        rules={[{ required: true }]}
                    >
                        <Select style={{ minWidth: 180 }}>
                            {MenhGia.map(item => (
                                <Option value={item}>{formatVnd(item)}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Nhap so seri ( ko bat buoc ) */}
                    <Form.Item label={'Seri'} name="serial">
                        <Cleave
                            className={styles.textInput}
                            placeholder=""
                            options={{
                                numericOnly: true,
                            }}
                        />
                    </Form.Item>

                    {/*  Nhap so the */}
                    <Form.Item
                        label={formatMessage({ id: 'CARD_NUMBER' })}
                        name="cardCode"
                        rules={[{ required: true }]}
                    >
                        <Cleave
                            className={styles.textInput}
                            placeholder=""
                            options={{
                                numericOnly: true,
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
}))(TopUpByTelecom);
