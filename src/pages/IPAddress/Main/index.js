import ic_agent from '@/assets/image/ic_agent.png';
import ic_delete from '@/assets/image/ic_delete.svg';

import EmptyComponent from '@/components/EmptyComponent';
import Loading from '@/components/Loading';
import { DATE_TIME_FULL, PAGE_SIZE } from '@/config/constant';
import { Modal, Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalAddMerchant from '../ModalAddMerchant';
import ModalCreate from '../ModalCreate';
import styles from './styles.scss';
const { confirm } = Modal;

function IPAddress(props) {
    let { dispatch, ipStore } = props;
    let {
        listIp,
        totalRow,
        loading,
        deleteSuccess,
        createSuccess,
        updateSuccess,
        listMerchant,
    } = ipStore;
    const [pageIndex, setPageIndex] = useState(1);
    const [modalCreate, setModalCreate] = useState(false);
    const [currentAddMerchant, setCurrentAddMerchant] = useState({
        isShow: false,
        id: undefined,
    });
    useEffect(() => {
        let payload = {
            role: 'ROLE_USER',
            deleted: false,
        };
        dispatch({ type: 'IP_ADDRESS/getMerchants', payload });
    }, [dispatch]);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            status: 'ON',
        };
        dispatch({ type: 'IP_ADDRESS/getListIp', payload });
    }, [pageIndex, dispatch, deleteSuccess, createSuccess, updateSuccess]);

    const handleDelete = id => {
        confirm({
            title: formatMessage({ id: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_IP' }),
            onOk: () => {
                const payload = { id };
                dispatch({ type: 'IP_ADDRESS/deleteIp', payload });
            },
            onCancel: () => {},
        });
    };

    const handleAddMerchant = (id, ipAddress) => {
        setCurrentAddMerchant({
            isShow: true,
            id,
            ipAddress,
        });
    };

    const renderDataIP = loading ? (
        <Loading />
    ) : listIp.length === 0 ? (
        <EmptyComponent />
    ) : (
        listIp.map((value, index) => (
            <tr className="row text-center" key={(value, index)}>
                <td className="col-1">{value.id}</td>
                <td className="col-2">{value.ipAddress}</td>
                <td className="col-3">
                    {listMerchant.find(merchant => merchant.id === value.ownerId)?.phone || '---'}
                </td>
                <td className="col-3">{moment(value.createdAt).format(DATE_TIME_FULL)}</td>
                <td className="col-3">
                    <img
                        className={styles.sizeIcon}
                        src={ic_delete}
                        onClick={() => handleDelete(value.id)}
                        alt="Delete"
                        style={{ marginRight: 5 }}
                    />
                    {!value.ownerId && (
                        <img
                            className={styles.sizeIcon}
                            src={ic_agent}
                            onClick={() => handleAddMerchant(value.id, value.ipAddress)}
                            alt="Thêm khách hàng"
                            title="Thêm khách hàng"
                        />
                    )}
                </td>
            </tr>
        ))
    );

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <h3>{formatMessage({ id: 'IP_ADDRESS_MANAGEMENT' })}</h3>
                </div>
                <div style={{ height: 40 }}>
                    <button className={styles.primaryBtn} onClick={() => setModalCreate(true)}>
                        {formatMessage({ id: 'ADD_IP_ADDRESS' })}
                    </button>
                </div>
            </div>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr className="text-center">
                            <th className="col-1"> {formatMessage({ id: 'ID' })}</th>
                            <th className="col-2"> {formatMessage({ id: 'IP_ADDRESS' })}</th>
                            <th className="col-3"> {formatMessage({ id: 'MERCHANT' })}</th>
                            <th className="col-3">{formatMessage({ id: 'CREATED_AT' })}</th>
                            <th className="col-3">{formatMessage({ id: 'ACTION' })}</th>
                        </tr>
                    </thead>
                    <tbody>{renderDataIP}</tbody>
                </table>

                <div className={styles.pagination}>
                    <Pagination
                        onChange={page => setPageIndex(page)}
                        defaultCurrent={pageIndex}
                        current={pageIndex}
                        size="small"
                        total={totalRow}
                        pageSize={PAGE_SIZE}
                    />
                </div>
            </div>
            <ModalCreate modalCreate={modalCreate} setModalCreate={setModalCreate} />

            {currentAddMerchant.isShow && (
                <ModalAddMerchant
                    currentAddMerchant={currentAddMerchant}
                    setCurrentAddMerchant={setCurrentAddMerchant}
                />
            )}
        </div>
    );
}

export default connect(({ IP_ADDRESS }) => ({
    ipStore: IP_ADDRESS,
}))(withRouter(IPAddress));
