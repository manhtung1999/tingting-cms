import { message, Modal } from 'antd';
import Cleave from 'cleave.js/react';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './styles.scss';
import ModalLoading from '@/components/ModalLoading';

function ModalUpdateAgent({ dispatch, currentAgent, setCurrentAgent, accountStore }) {
    const { detailAccount } = accountStore;
    const [depositAgent, setDepositAgent] = useState();
    const [withdrawAgent, setWithdrawAgent] = useState();
    console.log('detailAccount', detailAccount);

    useEffect(() => {
        const payload = { userId: currentAgent.id };
        dispatch({ type: 'ACCOUNT/getDetailAccount', payload });
    }, [currentAgent, dispatch]);

    const handleClose = () => {
        setCurrentAgent({
            ...currentAgent,
            isShow: false,
        });
    };

    useEffect(() => {
        if (detailAccount) {
            setDepositAgent(detailAccount.userMoneyConfig.agentPayFeeBank);
            setWithdrawAgent(detailAccount.userMoneyConfig.agentWithdrawFeeBank);
        }
    }, [detailAccount]);

    const handleSubmit = () => {
        if (!depositAgent || !withdrawAgent) {
            message.error(formatMessage({ id: 'REQUIRE_VALUE' }));
            return;
        }
        const payload = {
            ownerId: currentAgent.id,
            dailyWithdrawMoney: detailAccount.userMoneyConfig.dailyWithdrawMoney,
            oneTimesWithdrawMoney: detailAccount.userMoneyConfig.oneTimesWithdrawMoney,
            agentPayFeeBank: depositAgent,
            agentPayFeeQrBank: depositAgent,
            agentPayFeeWallet: depositAgent,
            agentPayFeeWalletQr: depositAgent,
            agentPayFeeUsdt: depositAgent,
            systemPayFeeQrBank: detailAccount.userMoneyConfig.systemPayFeeQrBank,
            systemPayFeeBank: detailAccount.userMoneyConfig.systemPayFeeBank,
            systemPayFeeWalletQr: detailAccount.userMoneyConfig.systemPayFeeWalletQr,
            systemPayFeeWallet: detailAccount.userMoneyConfig.systemPayFeeWallet,
            systemPayFeeUsdt: detailAccount.userMoneyConfig.systemPayFeeUsdt,
            agentWithdrawFeeQrBank: withdrawAgent,
            agentWithdrawFeeBank: withdrawAgent,
            agentWithdrawFeeWalletQr: withdrawAgent,
            agentWithdrawFeeWallet: withdrawAgent,
            systemWithdrawFeeQrBank: detailAccount.userMoneyConfig.systemWithdrawFeeQrBank,
            systemWithdrawFeeBank: detailAccount.userMoneyConfig.systemWithdrawFeeBank,
            systemWithdrawFeeWalletQr: detailAccount.userMoneyConfig.systemWithdrawFeeWalletQr,
            systemWithdrawFeeWallet: detailAccount.userMoneyConfig.systemWithdrawFeeWallet,
        };
        dispatch({ type: 'ACCOUNT/configMoney', payload });
        handleClose();
    };

    const handleChangeDeposit = e => {
        setDepositAgent(Number(e.currentTarget.rawValue));
    };

    const handleChangeWithdraw = e => {
        setWithdrawAgent(Number(e.currentTarget.rawValue));
    };

    if (!detailAccount) {
        return <ModalLoading />;
    }

    return (
        <Modal
            title={formatMessage({ id: 'CONFIG_PERCENT_COMMISSION_DEPOSIT_WITHDRAW' })}
            visible={currentAgent.isShow}
            wrapClassName={styles.modal}
            onOk={handleSubmit}
            okText={formatMessage({ id: 'SUBMIT' })}
            onCancel={handleClose}
            destroyOnClose
        >
            <div className={styles.form}>
                <div>
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'DEPOSIT_COMMISSION_PERCENTAGE' })} ( % ):
                    </span>
                    <Cleave
                        value={detailAccount.userMoneyConfig.agentPayFeeBank}
                        className={styles.textInputLight}
                        onChange={handleChangeDeposit}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                        }}
                    />
                </div>

                <div className="mt-4">
                    <span className="mb-2 d-block">
                        {formatMessage({ id: 'WITHDRAW_COMMISSION_PERCENTAGE' })} ( % ):
                    </span>

                    <Cleave
                        value={detailAccount.userMoneyConfig.agentWithdrawFeeBank}
                        className={styles.textInputLight}
                        onChange={handleChangeWithdraw}
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
}))(ModalUpdateAgent);
