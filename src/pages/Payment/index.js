import { connect } from 'dva';
import React from 'react';
import { withRouter } from 'umi';
import ModalLoading from '../../components/ModalLoading';
import styles from './styles.scss';
import logo_tingting from '@/assets/image/logo_tingting.png';
import ic_vpbank from '@/assets/image/ic_vpbank.png';
import ic_lienviet from '@/assets/image/ic_lienviet.png';
import ic_vcb from '@/assets/image/ic_vcb.png';
import ic_pvcombank from '@/assets/image/ic_pvcombank.png';
import ic_shb from '@/assets/image/ic_shb.png';
import ic_vietinbank from '@/assets/image/ic_vietinbank.png';
import ic_bidv from '@/assets/image/ic_bidv.png';
import ic_techcombank from '@/assets/image/ic_techcombank.png';
import ic_tpbank from '@/assets/image/ic_tpbank.png';
import ic_momo from '@/assets/image/ic_momo.png';
import ic_zalopay from '@/assets/image/ic_zalopay.png';
import qrcode from '@/assets/image/qrcode.png';
import Usdt from './Usdt';
import { formatVnd } from '@/util/function';

// usdt
// bank
// qr bank
// wallet
// responsive
function Payment({ location }) {
    const { query } = location;

    if (!query) {
        return <ModalLoading />;
    }
    return (
        <>
            {query.bankName === 'USDT' ? (
                <Usdt query={query} />
            ) : (
                <div className={styles.app}>
                    <div className={styles.container}>
                        <div className={styles.contentPayment}>
                            <div className={styles.infoTingting}>
                                <img className={styles.logoTingting} src={logo_tingting} alt="" />
                            </div>
                            <div className={styles.contentText}>
                                {query.linkImage === 'null' || query.linkImage === 'undefined' ? (
                                    <div className={styles.infoBank}>
                                        <h4>Số tài khoản: {query.bankAccount}</h4>
                                        <h4>Ngân hàng: {query.bankName}</h4>
                                        <h4>Chủ tài khoản: {query.bankUsername}</h4>
                                        <h4>Số tiền: {formatVnd(Number(query.amount))}</h4>
                                        <h4>
                                            Nội dung:{' '}
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: 'red',
                                                    marginLeft: 5,
                                                }}
                                            >
                                                {query.content}
                                            </span>
                                        </h4>
                                    </div>
                                ) : (
                                    <div className={styles.qrCode}>
                                        <img src={qrcode} alt="" />
                                        <div className={styles.time}>
                                            *QR sẽ hết hạn trong 2 phút
                                        </div>
                                    </div>
                                )}
                                <h5>Quý khách lưu ý</h5>
                                {query.bankName === 'Momo' || query.bankName === 'ZaloPay' ? (
                                    <div>
                                        <p>- Chú ý nội dung chuyển khoản chính xác</p>
                                        <p>
                                            - Sau 5 phút chưa thấy tài khoản cộng điểm phiền bạn
                                            liên hệ CSKH
                                        </p>
                                        <p>
                                            - Khách hàng muốn hỗ trợ nạp nhanh số tiền lớn liên hệ
                                            CSKH
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>- Khách hàng chọn hình thức chuyển 24/7</p>
                                        <p>- Ngân hàng chúng tôi đều miễn phí chuyển tiền</p>
                                        <p>- Chú ý nội dung chuyển khoản chính xác</p>
                                        <p>
                                            - Sau 5 phút chưa thấy tài khoản cộng điểm phiền bạn
                                            liên hệ CSKH
                                        </p>
                                        <p>
                                            - Khách hàng muốn hỗ trợ nạp nhanh số tiền lớn liên hệ
                                            CSKH
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {query.bankName === 'Momo' ? (
                        <div className={styles.footerWallet}>
                            <img src={ic_momo} alt="" />
                        </div>
                    ) : query.bankName === 'ZaloPay' ? (
                        <div className={styles.footerWallet}>
                            <img src={ic_zalopay} alt="" />
                        </div>
                    ) : (
                        <div className={styles.footer}>
                            <img src={ic_vpbank} alt="" />
                            <img src={ic_lienviet} alt="" />
                            <img src={ic_vcb} alt="" />
                            <img src={ic_pvcombank} alt="" />
                            <img src={ic_shb} alt="" />
                            <img src={ic_vietinbank} alt="" />
                            <img src={ic_bidv} alt="" />
                            <img src={ic_techcombank} alt="" />
                            <img src={ic_tpbank} alt="" />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(withRouter(Payment));
