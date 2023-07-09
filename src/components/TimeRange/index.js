import { useState } from 'react';
import styles from './styles.scss';
import moment from 'moment';
const listRangeTime = [
    {
        key: 'yesterday',
        text: 'Hôm qua',
    },
    {
        key: 'today',
        text: 'Hôm nay',
    },
    {
        key: 'last_week',
        text: 'Tuần trước',
    },
    {
        key: 'this_week',
        text: 'Tuần này',
    },
    {
        key: 'last_month',
        text: 'Tháng trước',
    },
    {
        key: 'this_month',
        text: 'Tháng này',
    },
];

function RangeTimeComponent({ setRangeTime }) {
    const [idActive, setIdActive] = useState(null);

    const handleClickTime = key => {
        if (key === idActive) {
            console.log('2 times');
            setRangeTime([]);
            setIdActive(null);
            return;
        }
        let timeStart, timeEnd;
        switch (key) {
            case 'yesterday':
                timeStart = moment()
                    .subtract(1, 'day')
                    .startOf('day');
                timeEnd = moment().startOf('day');
                break;
            case 'today':
                timeStart = moment().startOf('day');
                timeEnd = moment();
                break;
            case 'last_week':
                timeStart = moment()
                    .subtract(1, 'week')
                    .startOf('week');
                timeEnd = moment().startOf('week');
                break;
            case 'this_week':
                timeStart = moment().startOf('week');
                timeEnd = moment();
                break;
            case 'last_month':
                timeStart = moment()
                    .subtract(1, 'month')
                    .startOf('month');
                timeEnd = moment().startOf('month');
                break;
            case 'this_month':
                timeStart = moment().startOf('month');
                timeEnd = moment();
                break;
            default:
                break;
        }
        timeStart = timeStart.format('YYYY-MM-DD HH:mm:ss.S');
        timeEnd = timeEnd.format('YYYY-MM-DD HH:mm:ss.S');
        console.log([timeStart, timeEnd]);
        setRangeTime([timeStart, timeEnd]);
        setIdActive(key);
    };

    const listTime = listRangeTime.map((item, index) => {
        return (
            <button
                className={
                    idActive === item.key ? `${styles.active} ${styles.timeItem}` : styles.timeItem
                }
                key={index}
                onClick={() => handleClickTime(item.key)}
            >
                {item.text}
            </button>
        );
    });

    return <div className={styles.timeRange}>{listTime}</div>;
}

export default RangeTimeComponent;
