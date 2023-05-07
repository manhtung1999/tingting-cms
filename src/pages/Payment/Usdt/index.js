import logo_tingting from '@/assets/image/logo_tingting.png';
import { formatVnd } from '@/util/function';
import React from 'react';
import styles from './styles.scss';
import ic_usdt from '@/assets/image/ic_usdt.png';
import { message } from 'antd';

function Usdt({ query }) {
    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <div className={styles.contentPayment}>
                    <div className={styles.infoTingting}>
                        <img className={styles.logoTingting} src={logo_tingting} alt="" />
                    </div>
                    <div className={styles.contentText}>
                        <div className={styles.infoBank}>
                            <h4>Số tiền: {formatVnd(Number(query.amount))}</h4>
                            <h4>
                                Tỉ giá: {formatVnd(Number(query.exchangeRate))}{' '}
                                <h4 className="ms-2 d-inline-block mb-0">(= 1$)</h4>
                            </h4>
                            <h4>USDT cần chuyển: $ {query.moneyUsdt} </h4>
                            <h4 className="d-flex">
                                Địa chỉ ví: {query.walletAddress}{' '}
                                <span
                                    style={{ marginLeft: 'auto', color: '#000' }}
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(query.walletAddress);
                                        message.success('copied!');
                                    }}
                                >
                                    Copy
                                </span>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footerWallet}>
                <img src={ic_usdt} alt="" />
            </div>
        </div>
    );
}

export default Usdt;
