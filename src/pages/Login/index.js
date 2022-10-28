/* eslint-disable jsx-a11y/anchor-is-valid */
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'umi';
import { formatMessage, setLocale } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalOtp from './ModalOtp';
import ModalLoading from '@/components/ModalLoading';

function Login({ dispatch, masterDataStore }) {
    let { isLogin, mailResponse, loginLoading } = masterDataStore;
    const [showOtp, setShowOtp] = useState(false);
    setLocale('en-US');

    useEffect(() => {
        if (mailResponse) {
            setShowOtp(true);
        }
    }, [mailResponse]);

    // chuyen vao man dashboard neu da dang nhap
    useEffect(() => {
        if (isLogin) {
            setShowOtp(false);
            dispatch({
                type: 'MASTERDATA/resetMail',
            });
            router.push('/home/deposit');
        }
    }, [isLogin]);
    const [form] = Form.useForm();

    const onSubmit = values => {
        values.username = values['username'].trim();
        values.password = values['password'].trim();
        dispatch({
            type: 'MASTERDATA/login',
            payload: values,
        });
    };

    const _handleKeyDown = e => {
        if (e.key === 'Enter') {
            const nextSibling = document.querySelector(`input[name=password]`);
            if (nextSibling !== null) {
                nextSibling.focus();
            }
        }
    };

    return (
        <div className={styles.login}>
            {loginLoading && <ModalLoading />}
            {showOtp && <ModalOtp showOtp={showOtp} setShowOtp={setShowOtp} />}
            <div className={styles.loginForm}>
                <div className={styles.form}>
                    <div className={styles.formTitle}>
                        <h3>{formatMessage({ id: 'LET_GET_STARTED' })}</h3>
                    </div>
                    <Form scrollToFirstError layout="vertical" onFinish={onSubmit} form={form}>
                        <Form.Item
                            label=""
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({ id: 'PLEASER_ENTER_USERNAME' }),
                                },
                            ]}
                            name="username"
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder={formatMessage({ id: 'USERNAME' })}
                                onKeyPress={_handleKeyDown}
                            />
                        </Form.Item>
                        <Form.Item
                            label=""
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({ id: 'PLEASER_ENTER_PASSWORD' }),
                                },
                            ]}
                            name="password"
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder={formatMessage({ id: 'PASSWORD' })}
                                name="password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Link
                                to="/forgot-password"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    display: 'inline-flex',
                                    alignItems: 'baseline',
                                }}
                            >
                                <LockOutlined className="me-2" />
                                {formatMessage({ id: 'FORGOT_PASSWORD' })}
                            </Link>
                        </Form.Item>
                        <button htmltype="submit" className={styles.signInBtn}>
                            {formatMessage({ id: 'SIGN_IN' })}
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(Login);
