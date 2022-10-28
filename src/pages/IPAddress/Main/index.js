import ic_delete from '@/assets/image/ic_delete.svg';
import EmptyComponent from '@/components/EmptyComponent';
import Loading from '@/components/Loading';
import { PAGE_SIZE, DATE_TIME_FULL } from '@/config/constant';
import { Modal, Pagination } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalCreate from '../ModalCreate';
import styles from './styles.scss';
import moment from 'moment';
const { confirm } = Modal;

function IPAddress(props) {
    let { dispatch, ipStore } = props;
    let { listIp, totalRow, loading, deleteSuccess, createSuccess } = ipStore;
    const [pageIndex, setPageIndex] = useState(1);
    const [modalCreate, setModalCreate] = useState(false);

    useEffect(() => {
        let payload = {
            page: pageIndex - 1,
            status: 'ON',
        };
        dispatch({ type: 'IP_ADDRESS/getListIp', payload });
    }, [pageIndex, dispatch, deleteSuccess, createSuccess]);

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

    const renderDataIP = loading ? (
        <Loading />
    ) : listIp.length === 0 ? (
        <EmptyComponent />
    ) : (
        listIp.map((value, index) => (
            <tr className="row text-center" key={(value, index)}>
                <td className="col-3">{value.id}</td>
                <td className="col-3">{value.ipAddress}</td>
                <td className="col-3">{moment(value.createdAt).format(DATE_TIME_FULL)}</td>
                <td className="col-3">
                    <img
                        className={styles.sizeIcon}
                        src={ic_delete}
                        onClick={() => handleDelete(value.id)}
                        alt="Delete"
                    />
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
                            <th className="col-3"> {formatMessage({ id: 'ID' })}</th>
                            <th className="col-3"> {formatMessage({ id: 'IP_ADDRESS' })}</th>
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
        </div>
    );
}

export default connect(({ IP_ADDRESS }) => ({
    ipStore: IP_ADDRESS,
}))(withRouter(IPAddress));
