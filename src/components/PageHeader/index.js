/* eslint-disable jsx-a11y/alt-text */
import ic_business from '@/assets/image/ic_business.svg';
import ic_card from '@/assets/image/ic_card.svg';
import ic_deposit from '@/assets/image/ic_deposit.svg';
import ic_setting from '@/assets/image/ic_setting.svg';
import ic_transaction from '@/assets/image/ic_transaction.svg';
import ic_withdraw from '@/assets/image/ic_withdraw.svg';
import logo_tingting from '@/assets/image/logo_tingting.jpg';
import { ADMIN_KEY } from '@/config/constant';
import { useLocalStorage } from '@/hooks';
import { Layout, Menu, message } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import { Role } from '../../config/constant';
import styles from './styles.scss';
import { formatVnd } from '@/util/function';
const { Sider } = Layout;
const { SubMenu } = Menu;

function PageHeader(props) {
    const { location, masterDataStore, dispatch } = props;
    const { detailAccount, listPaymentType, balanceTelecom } = masterDataStore;
    const [collapsed, setCollapsed] = useState(false);
    const [page, setPage] = useState(location.pathname);
    const [currentExchange, setCurrentExchange] = React.useState();

    const [admin] = useLocalStorage(ADMIN_KEY);

    useEffect(() => {
        dispatch({ type: 'MASTERDATA/getPaymentType' });
    }, [dispatch]);

    useEffect(() => {
        dispatch({ type: 'MASTERDATA/getBalanceTelecom' });
    }, [dispatch]);

    useEffect(() => {
        if (listPaymentType.length > 0) {
            const usdt = listPaymentType.find(i => i.sortNameBank === 'USDT');
            if (!usdt) {
                message.error(formatMessage({ id: 'DONT_HAVE_USDT' }));
                return;
            } else {
                setCurrentExchange(usdt.exchangeRate);
            }
        }
    }, [listPaymentType]);

    const cronGetAccount = () => {
        if (admin) {
            const payload = {
                userId: admin.id,
            };
            dispatch({ type: 'MASTERDATA/getDetailAccount', payload });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            cronGetAccount();
        }, 30000);
        return () => {
            clearInterval(interval);
        };
    }, [dispatch]);

    let listMenu = [
        {
            page: 'deposit',
            icon: <img src={ic_deposit} />,
            url: '/home/deposit',
            text: formatMessage({ id: 'DEPOSIT' }),
        },
        {
            page: 'withdraw',
            icon: <img src={ic_withdraw} />,
            url: '/home/withdraw',
            text: formatMessage({ id: 'WITHDRAW' }),
        },
    ];

    if (admin?.role === Role.ROLE_ADMIN) {
        const adminMenu = [
            {
                page: 'all-transaction',
                icon: <img src={ic_business} />,
                url: '/home/all-transaction',
                text: formatMessage({ id: 'HISTORY_TRANSACTION' }),
            },
            {
                page: 'account-manage',
                icon: <img src={ic_business} />,
                url: '/home/account-manage',
                text: formatMessage({ id: 'ACCOUNT_MANAGEMENT' }),
            },
            {
                page: 'admin',
                icon: <img src={ic_business} />,
                url: '/home/admin',
                text: formatMessage({ id: 'ADMIN' }),
            },
            {
                page: 'ip',
                icon: <img src={ic_business} />,
                url: '/home/ip-address',
                text: formatMessage({ id: 'IP_ADDRESS_MANAGEMENT' }),
            },
            {
                page: 'report',
                icon: <img src={ic_business} />,
                url: '/home/report',
                text: formatMessage({ id: 'REPORT' }),
            },
            {
                page: 'card',
                icon: <img src={ic_business} />,
                url: '/home/card-management',
                text: formatMessage({ id: 'CARD_MANAGEMENT' }),
            },
        ];
        listMenu = [...listMenu, ...adminMenu];
    }

    if (admin?.role === Role.ROLE_STAFF || admin?.role === Role.ROLE_ACCOUNTANT) {
        const staffMenu = [
            {
                page: 'all-transaction',
                icon: <img src={ic_business} />,
                url: '/home/all-transaction',
                text: formatMessage({ id: 'HISTORY_TRANSACTION' }),
            },
            {
                page: 'report',
                icon: <img src={ic_business} />,
                url: '/home/report',
                text: formatMessage({ id: 'REPORT' }),
            },
            {
                page: 'device-management',
                icon: <img src={ic_business} />,
                url: '/home/device-management',
                text: formatMessage({ id: 'DEVICE_MANAGEMENT' }),
            },
            {
                page: 'account-manage',
                icon: <img src={ic_business} />,
                url: '/home/account-manage',
                text: formatMessage({ id: 'MERCHANT' }),
            },
        ];
        listMenu = [...listMenu, ...staffMenu];
    }

    if (admin?.role === Role.ROLE_ACCOUNTANT) {
        const transferMenu = [
            {
                page: 'internal-transfer',
                icon: <img src={ic_business} />,
                url: '/home/internal-transfer',
                text: formatMessage({ id: 'TRANFER_BALANCE' }),
            },
        ];
        listMenu = [...listMenu, ...transferMenu];
    }

    if (admin?.role === Role.ROLE_USER) {
        const merchantMenu = [
            {
                page: 'report',
                icon: <img src={ic_business} />,
                url: '/home/report',
                text: formatMessage({ id: 'REPORT' }),
            },
            {
                page: 'history-withdraw-card',
                icon: <img src={ic_business} />,
                url: '/home/history-withdraw-card',
                text: formatMessage({ id: 'HISTORY_WITHDRAW_CARD' }),
            },
        ];
        listMenu = [...listMenu, ...merchantMenu];
    }

    if (admin?.role === Role.ROLE_AGENT) {
        const agentMenu = [
            {
                page: 'history-withdraw-card',
                icon: <img src={ic_business} />,
                url: '/home/history-withdraw-card',
                text: formatMessage({ id: 'HISTORY_WITHDRAW_CARD' }),
            },
        ];
        listMenu = [...listMenu, ...agentMenu];
    }

    useEffect(() => {
        setPage(location.pathname);
    }, [location.pathname]);

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    const renderListMenu = listMenu.map((menu, index) => {
        return (
            <Menu.Item
                key={menu.url}
                icon={menu.icon}
                className={
                    page === menu.url ||
                    page.includes(menu.subUrl) ||
                    page.includes(menu.subUrl1) ||
                    page.includes(menu.subUrl2) ||
                    page.includes(menu.subUrl3) ||
                    page.includes(menu.subUrl4)
                        ? styles.activeAdmin
                        : ''
                }
            >
                <Link to={menu.url}>
                    <span className={styles.menuText}>{menu.text}</span>
                </Link>
            </Menu.Item>
        );
    });
    return (
        <div className={styles.menuHeader}>
            <div className={styles.money}>
                {(admin?.role === Role.ROLE_USER || admin?.role === Role.ROLE_AGENT) && (
                    <div className={styles.balance}>
                        <span>{formatMessage({ id: 'BALANCE' })}: </span>
                        <span>{detailAccount && formatVnd(detailAccount?.currentMoney)}</span>
                        <span>
                            {detailAccount?.currentMoney &&
                                currentExchange &&
                                ` ( ${Number(detailAccount?.currentMoney / currentExchange).toFixed(
                                    2,
                                )} USDT )`}
                        </span>
                    </div>
                )}

                {/* {(admin?.role === Role.ROLE_ADMIN ||
                    admin?.role === Role.ROLE_ACCOUNTANT ||
                    admin?.role === Role.ROLE_STAFF) && (
                    <div className={styles.balance}>
                        <span>{formatMessage({ id: 'BALANCE_TELECOM' })}: </span>
                        <span>{balanceTelecom && formatVnd(balanceTelecom)}</span>
                    </div>
                )} */}

                {/* {admin?.role === Role.ROLE_AGENT && detailAccount.userMoneyConfig && (
                    <div className={styles.balance}>
                        <div>
                            <span>{formatMessage({ id: 'DEPOSIT_COMMISSION' })}:</span>
                            <span>{detailAccount.userMoneyConfig.agentPayFeeBank}%</span>
                        </div>
                        <div>
                            <span>{formatMessage({ id: 'WITHDRAW_COMMISSION' })}:</span>
                            <span>{detailAccount.userMoneyConfig.agentWithdrawFeeBank}%</span>
                        </div>
                    </div>
                )} */}
                {/* {admin?.role === Role.ROLE_USER && detailAccount.userMoneyConfig && (
                    <div className={styles.balance}>
                        <div>
                            <span>{formatMessage({ id: 'DEPOSIT_FEE' })}:</span>
                            <span>
                                {detailAccount.parentId
                                    ? detailAccount.userMoneyConfig.agentPayFeeBank +
                                      detailAccount.userMoneyConfig.systemPayFeeBank
                                    : detailAccount.userMoneyConfig.systemPayFeeBank}
                                %
                            </span>
                        </div>
                        <div>
                            <span>{formatMessage({ id: 'WITHDRAW_FEE' })}:</span>
                            <span>
                                {detailAccount.parentId
                                    ? detailAccount.userMoneyConfig.agentWithdrawFeeBank +
                                      detailAccount.userMoneyConfig.systemWithdrawFeeBank
                                    : detailAccount.userMoneyConfig.systemWithdrawFeeBank}
                                %
                            </span>
                        </div>
                    </div>
                )} */}
            </div>

            <Sider
                width={250}
                collapsedWidth={100}
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                mode="inline"
            >
                <div className={styles.logoMenu}>
                    <img style={{ width: collapsed ? 100 : 125 }} src={logo_tingting} alt="logo" />
                </div>
                <Menu theme="dark" mode="inline">
                    {renderListMenu}
                    {admin?.role === Role.ROLE_ADMIN && (
                        <SubMenu
                            key="sub4"
                            title={
                                <span>
                                    <img src={ic_card} alt="" />
                                    <span style={{ marginLeft: '10px' }}>
                                        {formatMessage({ id: 'CARD' })}
                                    </span>
                                </span>
                            }
                        >
                            <Menu.Item key="9" icon={<img src={ic_setting} />}>
                                <Link to="/home/device-management">
                                    <span className={styles.menuText}>
                                        {formatMessage({ id: 'DEVICE_MANAGEMENT' })}
                                    </span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="10" icon={<img src={ic_transaction} />}>
                                <Link to="/home/internal-transfer">
                                    <span className={styles.menuText}>
                                        {formatMessage({ id: 'TRANFER_BALANCE' })}
                                    </span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    )}
                </Menu>
            </Sider>
        </div>
    );
}

export default connect(({ MASTERDATA }) => ({
    masterDataStore: MASTERDATA,
}))(withRouter(PageHeader));
