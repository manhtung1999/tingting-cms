import { Form, message, Select } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import { formatVnd } from '@/util/function';
import { MIN_WITHDRAW } from '@/config/constant';
import { Radio, Input } from 'antd';

const { Option } = Select;

const TransferBalance = props => {
    const { dispatch, masterDataStore } = props;

    const { devices } = masterDataStore;

    const [totalMoney, setTotalMoney] = useState();
    const [mobileId, setMobileId] = useState();
    const [mobileIdReceiveMoney, setMobileIdReceiveMoney] = useState();
    const [typeTransfer, setTypeTransfer] = useState(1);

    const [form] = Form.useForm();

    useEffect(() => {
        const payload = {
            status: 'on',
        };
        dispatch({ type: 'MASTERDATA/getDevices', payload });
    }, [dispatch]);

    const handleSubmit = values => {
        const bankTransfer = devices.find(device => device.id === mobileId);
        const bankReceive = devices.find(device => device.id === mobileIdReceiveMoney);
        if (bankTransfer.bankName === 'ZaloPay' && bankReceive?.bankName === 'Momo') {
            message.error(formatMessage({ id: 'ERROR_DIFF_WALLET' }));
            return;
        }
        if (bankTransfer.bankName === 'Momo' && bankReceive?.bankName === 'ZaloPay') {
            message.error(formatMessage({ id: 'ERROR_DIFF_WALLET' }));
            return;
        }

        if (totalMoney <= 0) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        if (
            bankTransfer.bankName === 'ZaloPay' &&
            bankReceive?.bankName !== 'ZaloPay' &&
            totalMoney < 20000
        ) {
            message.error(formatMessage({ id: 'MIN_ZALOPAY_20K' }));
            return;
        }
        if (totalMoney < MIN_WITHDRAW) {
            message.error(formatMessage({ id: 'MIN_WITHDRAW_10000' }));
            return;
        }
        const payload = {
            totalMoney,
            mobileId,
        };

        if (typeTransfer === 1) {
            payload.mobileIdReceiveMoney = mobileIdReceiveMoney;
            dispatch({ type: 'MASTERDATA/transferBalance', payload });
        } else {
            payload.bankUsername = values.bankUsername;
            payload.bankAccount = values.bankAccount;
            payload.bankName = values.bankName;
            dispatch({ type: 'MASTERDATA/transferBalanceOutside', payload });
        }
    };

    const handleChangeDeposit = e => {
        setTotalMoney(Number(e.currentTarget.rawValue));
    };

    const onChangeType = e => {
        setTypeTransfer(e.target.value);
    };

    return (
        <div className={styles.content}>
            <div className={styles.pageTitle}>
                <h5>{formatMessage({ id: 'TRANFER_BALANCE' })}</h5>
            </div>

            <div className="mb-5 mt-3">
                <Radio.Group onChange={onChangeType} value={typeTransfer}>
                    <Radio value={1}>{formatMessage({ id: 'INTERNAL_MONEY_TRANSFER' })}</Radio>
                    <Radio value={2}>{formatMessage({ id: 'EXTERNAL_MONEY_TRANSFER' })}</Radio>
                </Radio.Group>
            </div>

            {typeTransfer === 2 && (
                <strong style={{ color: 'red', marginBottom: 20 }}>
                    ({formatMessage({ id: 'VIET_TAT_TEN_NH' })})
                </strong>
            )}
            <div className={styles.form}>
                <div className={styles.form}>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        form={form}
                        scrollToFirstError
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={formatMessage({ id: 'TRANSFER_ACC' })}
                            name="bank"
                            rules={[{ required: true }]}
                        >
                            <Select
                                style={{ minWidth: 300 }}
                                onChange={value => setMobileId(value)}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={devices
                                    .filter(device => !device.deviceOfUserId)
                                    .map(item => {
                                        return {
                                            value: item.id,
                                            label: `${item.bankName} - ${item.numberAccount} - ${
                                                item.username
                                            }- ${formatVnd(item.totalMoney)}`,
                                        };
                                    })}
                            ></Select>
                        </Form.Item>

                        {typeTransfer === 1 ? (
                            <Form.Item
                                label={formatMessage({ id: 'RECIPIENT_ACC' })}
                                name="receiptAcc"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ minWidth: 300 }}
                                    onChange={value => setMobileIdReceiveMoney(value)}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '')
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={devices
                                        .filter(device => !device.deviceOfUserId)
                                        .map(item => {
                                            return {
                                                value: item.id,
                                                label: `${item.bankName} - ${
                                                    item.numberAccount
                                                } - ${item.username}- ${formatVnd(
                                                    item.totalMoney,
                                                )}`,
                                            };
                                        })}
                                ></Select>
                            </Form.Item>
                        ) : (
                            <>
                                <Form.Item
                                    label={formatMessage({ id: 'BANK_NAME' })}
                                    rules={[{ required: true }]}
                                    name="bankName"
                                >
                                    <Input className={styles.textInput} />
                                </Form.Item>

                                <Form.Item
                                    label={formatMessage({ id: 'ACCOUNT_HOLDER' })}
                                    rules={[{ required: true }]}
                                    name="bankUsername"
                                >
                                    <Input className={styles.textInput} />
                                </Form.Item>

                                <Form.Item
                                    label={formatMessage({ id: 'ACCOUNT_NUMBER' })}
                                    rules={[{ required: true }]}
                                    name="bankAccount"
                                >
                                    <Input className={styles.textInput} />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item
                            label={formatMessage({ id: 'AMOUNT' })}
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <Cleave
                                value={totalMoney}
                                className={styles.textInput}
                                onChange={handleChangeDeposit}
                                options={{
                                    numeral: true,
                                    numeralThousandsGroupStyle: 'thousand',
                                }}
                            />
                        </Form.Item>
                        <div className="d-flex justify-content-end">
                            <button htmlType="submit" className={styles.primaryBtn}>
                                {formatMessage({ id: 'SUBMIT' })}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(TransferBalance);
