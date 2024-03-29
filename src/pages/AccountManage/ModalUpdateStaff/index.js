import { message, Modal } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';
import ModalUpdateBalance from '../ModalUpdateBalance';
import { formatVnd } from '@/util/function';

function ModalUpdateStaff({ dispatch, currentStaff, setCurrentStaff, accountStore }) {
    const { detailAccount, accounts, agents } = accountStore;
    const [infoFee, setInfoFee] = useState();

    useEffect(() => {
        dispatch({ type: 'ACCOUNT/getDevices' });
    }, [dispatch]);

    useEffect(() => {
        let payload = {
            deleted: false,
            role: 'ROLE_AGENT',
        };

        dispatch({ type: 'ACCOUNT/getAgents', payload });
    }, [dispatch]);

    useEffect(() => {
        const payload = { userId: currentStaff.id };
        dispatch({ type: 'ACCOUNT/getDetailAccount', payload });
    }, [currentStaff, dispatch]);

    const handleClose = () => {
        setCurrentStaff({
            ...currentStaff,
            isShow: false,
        });
    };

    useEffect(() => {
        if (detailAccount) {
            setInfoFee({ ...detailAccount.userMoneyConfig });
        }
    }, [detailAccount]);

    const handleSubmit = () => {
        if (
            infoFee.agentPayFeeBank === undefined ||
            infoFee.agentPayFeeWallet === undefined ||
            infoFee.agentPayFeeUsdt === undefined ||
            infoFee.systemPayFeeBank === undefined ||
            infoFee.systemPayFeeWallet === undefined ||
            infoFee.systemPayFeeUsdt === undefined ||
            infoFee.agentWithdrawFeeBank === undefined ||
            infoFee.agentWithdrawFeeWallet === undefined ||
            infoFee.systemWithdrawFeeBank === undefined ||
            infoFee.systemWithdrawFeeWallet === undefined ||
            infoFee.systemPayFeeCard === undefined ||
            infoFee.agentPayFeeCard === undefined ||
            infoFee.systemWithdrawFeeCard === undefined ||
            infoFee.agentWithdrawFeeCard === undefined
        ) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const payload = {
            ownerId: currentStaff.id,
            dailyWithdrawMoney: detailAccount.userMoneyConfig.dailyWithdrawMoney,
            oneTimesWithdrawMoney: detailAccount.userMoneyConfig.oneTimesWithdrawMoney,

            agentPayFeeBank: infoFee.agentPayFeeBank,
            agentPayFeeQrBank: infoFee.agentPayFeeBank,
            agentPayFeeWallet: infoFee.agentPayFeeWallet,
            agentPayFeeWalletQr: infoFee.agentPayFeeWallet,
            agentPayFeeUsdt: infoFee.agentPayFeeUsdt,

            systemPayFeeQrBank: infoFee.systemPayFeeBank,
            systemPayFeeBank: infoFee.systemPayFeeBank,
            systemPayFeeWalletQr: infoFee.systemPayFeeWallet,
            systemPayFeeWallet: infoFee.systemPayFeeWallet,
            systemPayFeeUsdt: infoFee.systemPayFeeUsdt,

            agentWithdrawFeeQrBank: infoFee.agentWithdrawFeeBank,
            agentWithdrawFeeBank: infoFee.agentWithdrawFeeBank,
            agentWithdrawFeeWalletQr: infoFee.agentWithdrawFeeWallet,
            agentWithdrawFeeWallet: infoFee.agentWithdrawFeeWallet,

            systemWithdrawFeeQrBank: infoFee.systemWithdrawFeeBank,
            systemWithdrawFeeBank: infoFee.systemWithdrawFeeBank,
            systemWithdrawFeeWalletQr: infoFee.systemWithdrawFeeWallet,
            systemWithdrawFeeWallet: infoFee.systemWithdrawFeeWallet,

            systemPayFeeCard: infoFee.systemPayFeeCard,
            agentPayFeeCard: infoFee.agentPayFeeCard,
            systemWithdrawFeeCard: infoFee.systemWithdrawFeeCard,
            agentWithdrawFeeCard: infoFee.agentWithdrawFeeCard,
        };
        dispatch({ type: 'ACCOUNT/configMoney', payload });
        handleClose();
    };

    const handleChangeDeposit = (e, key) => {
        setInfoFee({
            ...infoFee,
            [key]: Number(e.currentTarget.rawValue),
        });
    };

    if (!detailAccount) {
        return <ModalLoading />;
    }

    let acc = accounts.find(acc => acc.id === detailAccount.id);
    const renderBankConnected = acc
        ? acc.mobileDevices.map((item, index) => {
              return (
                  <p>
                      <div>Bank ID: {item.paymentTypeId}</div>
                      {item.bankName}-{item.numberAccount}-{item.username}-
                      {formatVnd(item.currentMoney)}
                  </p>
              );
          })
        : null;

    let agent = agents.find(agent => agent.id === detailAccount.parentId);
    let agentName = agent ? agent.phone : null;

    return (
        <Modal
            title={formatMessage({ id: 'CONFIG_PERCENT_DEPOSIT_WITHDRAW_AND_BALANCE' })}
            visible={currentStaff.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <div className="mb-3">
                    <h5>{formatMessage({ id: 'AGENT' })}:</h5>
                    <span>{agentName || 'Chưa có đại lý'}</span>
                </div>
                <div className="mb-3">
                    <h5>{formatMessage({ id: 'BANK_LIEN_KET' })}:</h5>
                    {renderBankConnected}
                </div>
                <ModalUpdateBalance id={currentStaff.id} currentMoney={currentStaff.currentMoney} />
                {/* phi nap bank cho dai ly */}
                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_BANK_FOR_AGENT' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.agentPayFeeBank}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentPayFeeBank')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi nap vi cho dai ly */}
                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_WALLET_FOR_AGENT' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.agentPayFeeWallet}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentPayFeeWallet')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi nap usdt cho dai ly */}
                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_USDT_FOR_AGENT' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.agentPayFeeUsdt}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentPayFeeUsdt')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi rut bank cho dai ly */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAWAL_FEE_BANK_FOR_AGENT' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.agentWithdrawFeeBank}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentWithdrawFeeBank')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi rut vi cho dai ly */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAWAL_FEE_WALLET_FOR_AGENT' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.agentWithdrawFeeWallet}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentWithdrawFeeWallet')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi nap bank cho he thong */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_BANK_FOR_SYSTEM' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.systemPayFeeBank}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemPayFeeBank')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi nap vi cho he thong */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_WALLET_FOR_SYSTEM' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.systemPayFeeWallet}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemPayFeeWallet')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi nap usdt cho he thong */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_USDT_FOR_SYSTEM' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.systemPayFeeUsdt}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemPayFeeUsdt')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi rut bank cho he thong */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAWAL_FEE_BANK_FOR_SYSTEM' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.systemWithdrawFeeBank}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemWithdrawFeeBank')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi rut vi cho he thong */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAWAL_FEE_WALLET_FOR_SYSTEM' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.systemWithdrawFeeWallet}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemWithdrawFeeWallet')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* ---- config fee for card telecom ----- */}
                {/* phi nap thẻ cho he thong */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_CARD_FOR_SYSTEM' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.systemPayFeeCard}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemPayFeeCard')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi rut thẻ cho hệ thống*/}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAWAL_FEE_CARD_FOR_SYSTEM' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.systemWithdrawFeeCard}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'systemWithdrawFeeCard')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi nạp thẻ cho đại lý*/}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_FEE_CARD_FOR_AGENT' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.agentPayFeeCard}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentPayFeeCard')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                {/* phi rut the dien thoai cho đại lý */}
                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAWAL_FEE_CARD_FOR_AGENT' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.agentWithdrawFeeCard}
                        className={styles.textInputLight}
                        onChange={e => handleChangeDeposit(e, 'agentWithdrawFeeCard')}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
}
export default connect(({ ACCOUNT }) => ({
    accountStore: ACCOUNT,
}))(ModalUpdateStaff);
