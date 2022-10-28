import ic_delete from '@/assets/image/ic_delete.svg';
import ic_edit from '@/assets/image/ic_edit.svg';
import { Modal } from 'antd';
import { connect } from 'dva';
import React, { useState, useRef } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import AddInfo from './AddInfo';
import EditInfo from './EditInfo';
import styles from './styles.scss';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Table } from 'antd';
const type = 'DragableBodyRow';

function ModalListInfo({
    updateObj,
    dispatch,
    deviceStore,
    setCurrentManipulation,
    currentManipulation,
}) {
    const { actionObj } = deviceStore;
    const [isShow, setIsShow] = useState(false);

    const [currentInfo, setCurrentInfo] = useState({
        isShow: false,
        index: undefined,
        value: undefined,
    });

    const handleUpdate = () => {
        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));
        manipulations[currentManipulation.index] = JSON.parse(JSON.stringify(updateObj));
        const payload = {
            ...actionObj,
            manipulations,
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
        setIsShow(false);
    };

    const handleDeleteInfo = indexDelete => {
        let newInfos = [...currentManipulation.value.infos];

        setCurrentManipulation({
            ...currentManipulation,
            value: {
                ...currentManipulation.value,
                infos: newInfos.filter((item, index) => index !== indexDelete),
            },
        });
    };

    const handleEditInfo = (index, value) => {
        setCurrentInfo({
            isShow: true,
            index,
            value,
        });
    };

    const DragableBodyRow = ({ index, moveRow, className, ...restProps }) => {
        const ref = useRef();
        const [{ isOver, dropClassName }, drop] = useDrop({
            accept: type,
            collect: monitor => {
                const { index: dragIndex } = monitor.getItem() || {};
                if (dragIndex === index) {
                    return dragIndex;
                }
                return {
                    isOver: monitor.isOver(),
                    dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
                };
            },
            drop: item => {
                moveRow(item.index, index);
            },
        });
        const [, drag] = useDrag({
            item: { index },
            type,
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            }),
        });
        drop(drag(ref));
        return (
            <tr
                ref={ref}
                className={`${className}${isOver ? dropClassName : ''}`}
                style={{ cursor: 'move' }}
                {...restProps}
            />
        );
    };

    const components = {
        body: {
            row: DragableBodyRow,
        },
    };

    // dragIndex: index đi, hoverIndex: index đến
    const moveRow = (dragIndex, hoverIndex) => {
        let newInfos = [...currentManipulation.value.infos];

        newInfos[dragIndex] = JSON.parse(
            JSON.stringify(currentManipulation.value.infos[hoverIndex]),
        );
        newInfos[hoverIndex] = JSON.parse(
            JSON.stringify(currentManipulation.value.infos[dragIndex]),
        );

        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));
        manipulations[currentManipulation.index] = JSON.parse(JSON.stringify(updateObj));
        manipulations[currentManipulation.index].infos = JSON.parse(JSON.stringify(newInfos));

        // cập nhật lại current thao tác
        setCurrentManipulation({
            ...currentManipulation,
            value: {
                ...updateObj,
                infos: JSON.parse(JSON.stringify(newInfos)),
            },
        });

        const payload = {
            ...actionObj,
            manipulations,
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
    };

    const columns = [
        {
            title: formatMessage({ id: 'text' }),
            dataIndex: 'text',
            key: 'text',
            align: 'center',
            render: (text, record) => <div>{text}</div>,
            ellipsis: true,
        },
        {
            title: formatMessage({ id: 'viewId' }),
            dataIndex: 'viewId',
            key: 'viewId',
            align: 'center',
            render: (text, record) => <div>{text}</div>,
        },
        {
            title: formatMessage({ id: 'hint' }),
            dataIndex: 'hint',
            key: 'hint',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'bounds' }),
            dataIndex: 'bounds',
            key: 'bounds',
            align: 'center',
            render: (text, record) => <div>{text}</div>,
        },
        {
            title: formatMessage({ id: 'description' }),
            dataIndex: 'description',
            key: 'description',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'pattern' }),
            dataIndex: 'pattern',
            key: 'pattern',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'transactionFieldIndex' }),
            dataIndex: 'transactionFieldIndex',
            key: 'transactionFieldIndex',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'parentCount' }),
            dataIndex: 'parentCount',
            key: 'parentCount',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'childIndexes' }),
            dataIndex: 'childIndexes',
            key: 'childIndexes',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'ACTION' }),
            dataIndex: '',
            key: 'action',
            render: (text, record, index) => (
                <div>
                    <span
                        style={{ marginRight: 20, cursor: 'pointer' }}
                        onClick={() => handleEditInfo(index, record)}
                    >
                        <img className={styles.iconSize} src={ic_edit} alt="" />
                    </span>
                    <span style={{ cursor: 'pointer' }} onClick={() => handleDeleteInfo(index)}>
                        <img className={styles.iconSize} src={ic_delete} alt="" />
                    </span>
                </div>
            ),
            align: 'center',
        },
    ];
    return (
        <>
            {currentInfo.isShow && (
                <EditInfo
                    currentInfo={currentInfo}
                    setCurrentInfo={setCurrentInfo}
                    currentManipulation={currentManipulation}
                    setCurrentManipulation={setCurrentManipulation}
                    updateObjManipulation={updateObj}
                />
            )}
            <div style={{ height: 40, marginLeft: 'auto' }}>
                <button className={styles.primaryBtn} onClick={() => setIsShow(true)}>
                    {formatMessage({ id: 'EDIT_INFO' })}
                </button>
            </div>
            <Modal
                title={formatMessage({ id: 'INFO_LIST' })}
                visible={isShow}
                wrapClassName={styles.modal}
                onOk={handleUpdate}
                okText={formatMessage({ id: 'OK' })}
                onCancel={() => setIsShow(false)}
                destroyOnClose
            >
                <div className={styles.tableDrag}>
                    <DndProvider backend={HTML5Backend}>
                        <Table
                            columns={columns}
                            dataSource={currentManipulation.value.infos}
                            components={components}
                            onRow={(record, index) => ({
                                index,
                                moveRow,
                            })}
                            rowKey={record => record.manipulationType}
                            pagination={false}
                        />
                    </DndProvider>
                </div>
                <AddInfo
                    currentManipulation={currentManipulation}
                    setCurrentManipulation={setCurrentManipulation}
                />
            </Modal>
        </>
    );
}
export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(ModalListInfo);
