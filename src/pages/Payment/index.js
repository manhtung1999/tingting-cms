import { formatVnd } from '@/util/function';
import { Button, Typography } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalLoading from '../../components/ModalLoading';
import styles from './styles.scss';

const { Paragraph } = Typography;

function Payment({ location }) {
    const { query } = location;

    if (!query) {
        return <ModalLoading />;
    }

    const handleClose = () => {
        window.open('', '_self', '');
        window.close();
    };
    return (
        <div className={styles.container}>
            <h2 className="mb-4">{formatMessage({ id: 'INFO_TRANSFER_BANK' })}:</h2>
            <div style={{ background: 'rgb(227,225,225)', padding: 30 }}>
                {query.bankName === 'USDT' ? (
                    <>
                        <h3>
                            {formatMessage({ id: 'AMOUNT' })}: {query.amount}{' '}
                            <h3 className="ms-2 d-inline-block" style={{ color: '#000' }}>
                                VND
                            </h3>
                        </h3>
                        <h3>
                            {formatMessage({ id: 'EXCHANGE_RATE' })}: {query.exchangeRate}{' '}
                            <h3 className="ms-2 d-inline-block" style={{ color: '#000' }}>
                                VND (= 1$) ( {formatMessage({ id: 'DA_BAO_GOM_CAC_KHOAN_PHI' })})
                            </h3>
                        </h3>
                        <h3>
                            {formatMessage({ id: 'USDT_TO_DEPOSIT' })}: {query.moneyUsdt}{' '}
                            <h3 className="ms-2 d-inline-block" style={{ color: '#000' }}>
                                USDT
                            </h3>
                        </h3>
                        <h3>
                            <Paragraph copyable={{ text: query.walletAddress }}>
                                {formatMessage({ id: 'WALLET_ADDRESS' })}: {query.walletAddress}
                            </Paragraph>
                        </h3>
                    </>
                ) : (
                    <>
                        {(query.linkImage === 'null' || query.linkImage === 'undefined') && (
                            <>
                                <h3>
                                    <Paragraph copyable={{ text: query.bankAccount }}>
                                        {formatMessage({ id: 'ACCOUNT_NUMBER' })}:{' '}
                                        {query.bankAccount}
                                    </Paragraph>
                                </h3>
                                <h3 className="my-3">
                                    {formatMessage({ id: 'BANK_NAME' })}: {query.bankName}
                                </h3>
                                <h3>
                                    <Paragraph copyable={{ text: query.bankUsername }}>
                                        {formatMessage({ id: 'ACCOUNT_HOLDER' })}:{' '}
                                        {query.bankUsername}
                                    </Paragraph>
                                </h3>
                            </>
                        )}

                        <h3>
                            <Paragraph copyable={{ text: query.amount }}>
                                {formatMessage({ id: 'AMOUNT' })}: {formatVnd(query.amount)}
                            </Paragraph>
                        </h3>
                        {query.bankName !== 'USDT' && (
                            <h3 className="mt-3 d-flex">
                                {formatMessage({ id: 'MONEY_TRANSFER_CONTENT' })}:{' '}
                                <Paragraph copyable={{ text: query.content }}>
                                    <span
                                        style={{ fontWeight: 'bold', color: 'red', marginLeft: 5 }}
                                    >
                                        {query.content}
                                    </span>
                                </Paragraph>
                            </h3>
                        )}

                        {query.linkImage !== 'null' && query.linkImage !== 'undefined' && (
                            <h3 className="mt-3">
                                {formatMessage({ id: 'QR_CODE' })}:{' '}
                                <div className="mt-3">
                                    <img
                                        style={{
                                            width: 250,
                                        }}
                                        src={query.linkImage}
                                        alt="qr-link"
                                    />
                                </div>
                            </h3>
                        )}
                    </>
                )}
            </div>
            <div className="d-flex justify-content-center mt-4">
                <Button
                    style={{ color: '#fff', background: '#3f3f65', borderRadius: '20px' }}
                    className="primary"
                    size="large"
                    onClick={handleClose}
                >
                    {formatMessage({ id: 'COMPLETE' })}
                </Button>
            </div>
            <div
                className="mt-3 d-flex justify-content-center"
                style={{ color: 'red', fontSize: 14 }}
            >
                {formatMessage({ id: 'NOTICE_PAYMENT' })}
            </div>
        </div>
    );
}
export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(withRouter(Payment));
