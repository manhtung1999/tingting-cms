import logo_tingting from '@/assets/image/logo_tingting.png';
import { formatVnd } from '@/util/function';
import React from 'react';
import styles from './styles.scss';
import ic_usdt from '@/assets/image/ic_usdt.png';

function Usdt({ query }) {
    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <div className={styles.contentPayment}>
                    <div className={styles.infoTingting}>
                        <img className={styles.logoTingting} src={logo_tingting} alt="" />
                    </div>
                    <div className={styles.contentText}>
                        <h3>Số tiền: {formatVnd(Number(query.amount))}</h3>
                        <h3>
                            Tỉ giá: {formatVnd(Number(query.exchangeRate))}{' '}
                            <h3 className="ms-2 d-inline-block">(= 1$)</h3>
                        </h3>
                        <h3>USDT cần chuyển: $ {query.moneyUsdt} </h3>
                        <h3>Địa chỉ ví: {query.walletAddress}</h3>
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
