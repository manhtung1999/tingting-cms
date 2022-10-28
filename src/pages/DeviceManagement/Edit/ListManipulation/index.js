import ic_delete from '@/assets/image/ic_delete.svg';
import ic_edit from '@/assets/image/ic_edit.svg';
import { Table } from 'antd';
import { connect } from 'dva';
import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { formatMessage } from 'umi-plugin-react/locale';
import AddManipulation from './AddManipulation';
import ModalUpdateManipulation from './ModalUpdateManipulation';
import styles from './styles.scss';

const type = 'DragableBodyRow';

function ListManipulation({ deviceStore, dispatch }) {
    const { actionObj } = deviceStore;

    const [currentManipulation, setCurrentManipulation] = useState({
        isShow: false,
        index: undefined,
        value: undefined,
    });

    const handleDeleteManipulation = indexDelete => {
        let manipulations = [...actionObj.manipulations];

        const payload = {
            ...actionObj,
            manipulations: manipulations.filter((item, index) => index !== indexDelete),
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
    };

    const handleEditManipulation = (index, value) => {
        setCurrentManipulation({
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
        let manipulations = JSON.parse(JSON.stringify(actionObj.manipulations));
        manipulations[dragIndex] = JSON.parse(JSON.stringify(actionObj.manipulations[hoverIndex]));
        manipulations[hoverIndex] = JSON.parse(JSON.stringify(actionObj.manipulations[dragIndex]));
        const payload = {
            ...actionObj,
            manipulations,
        };
        dispatch({ type: 'DEVICE/updateActionObj', payload });
    };

    const columns = [
        {
            title: formatMessage({ id: 'MANIPULATIONT_TYPE' }),
            dataIndex: 'manipulationType',
            key: 'manipulationType',
            align: 'center',
            render: (text, record) => (
                <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{text}</div>
            ),
            ellipsis: true,
        },
        {
            title: formatMessage({ id: 'FILL_TEXT_TYPE' }),
            dataIndex: 'fillTextType',
            key: 'fillTextType',
            align: 'center',
            render: (text, record) => <div>{text}</div>,
        },
        {
            title: formatMessage({ id: 'SCROLL_DIRECTION' }),
            dataIndex: 'scrollDirection',
            key: 'scrollDirection',
            align: 'center',
        },
        {
            title: formatMessage({ id: 'DELAY' }),
            dataIndex: 'delay',
            key: 'delay',
            align: 'center',
            render: (text, record) => <div>{text} ms</div>,
        },
        {
            title: formatMessage({ id: 'ACTION' }),
            dataIndex: '',
            key: 'action',
            render: (text, record, index) => (
                <div>
                    <span
                        style={{ marginRight: 20, cursor: 'pointer' }}
                        onClick={() => handleEditManipulation(index, record)}
                    >
                        <img className={styles.iconSize} src={ic_edit} alt="" />
                    </span>
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteManipulation(index)}
                    >
                        <img className={styles.iconSize} src={ic_delete} alt="" />
                    </span>
                </div>
            ),
            align: 'center',
        },
    ];
    const dataSource = actionObj.manipulations.map((manipulation, maniIndex) => {
        return {
            ...manipulation,
            key: maniIndex,
        };
    });
    return (
        <div className={styles.tableDrag}>
            {actionObj.manipulations.length > 0 && (
                <DndProvider backend={HTML5Backend}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        components={components}
                        onRow={(record, index) => ({
                            index,
                            moveRow,
                        })}
                        rowKey={record => record.manipulationType}
                        pagination={false}
                    />
                </DndProvider>
            )}
            {currentManipulation.isShow && (
                <ModalUpdateManipulation
                    currentManipulation={currentManipulation}
                    setCurrentManipulation={setCurrentManipulation}
                />
            )}

            <AddManipulation
                currentManipulation={currentManipulation}
                setCurrentManipulation={setCurrentManipulation}
            />
        </div>
    );
}

export default connect(({ DEVICE }) => ({
    deviceStore: DEVICE,
}))(ListManipulation);
