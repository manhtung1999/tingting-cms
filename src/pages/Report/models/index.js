import { message } from 'antd';
import { handleErrorModel } from '@/util/function';
import depositService from '@/services/deposit';
import accountService from '@/services/account';
import secretService from '@/services/secret';
import deviceService from '@/services/device';
import { formatMessage } from 'umi-plugin-react/locale';
export default {
    namespace: 'REPORT',
    state: {
        loading: false,
        listDeposit: [],
        listMerchant: [],
        listPaymentType: [],
        totalRow: 0,
        listSecret: [],
        deleteResponse: undefined,
        devices: [],
    },
    reducers: {
        loading(state, action) {
            return {
                ...state,
                loading: true,
            };
        },

        error(state, action) {
            return {
                ...state,
                loading: false,
            };
        },

        success(state, action) {
            return {
                ...state,
                loading: false,
            };
        },

        getDepositsSuccess(state, action) {
            return {
                ...state,
                loading: false,
                listDeposit: action.payload.body.transaction,
                totalRow: action.payload.totalRecord,
            };
        },
        getMerchantSuccess(state, action) {
            return {
                ...state,
                listMerchant: action.payload.body,
            };
        },

        getPaymentTypeSuccess(state, action) {
            return {
                ...state,
                listPaymentType: action.payload.body,
            };
        },

        getSecretKeySuccess(state, action) {
            return {
                ...state,
                listSecret: action.payload.body,
            };
        },

        deleteTransactionSuccess(state, action) {
            return {
                ...state,
                loading: false,
                deleteResponse: action.payload.body,
            };
        },
        getDevicesSuccess(state, action) {
            const prevDevice = [...state.devices];
            action.payload.body.map(i => {
                if (!prevDevice.find(item => item.id === i.id)) {
                    prevDevice.push(i);
                }
            });
            return {
                ...state,
                devices: prevDevice,
            };
        },
    },

    effects: {
        *getDeposits(action, { call, put }) {
            // yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.getDeposits, action.payload);
                if (res.status === 200) {
                    yield put({
                        type: 'getDepositsSuccess',
                        payload: res.body,
                    });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getSecretKey(action, { call, put }) {
            try {
                const res = yield call(secretService.getSecretKey, action.payload);
                if (res.status === 200) {
                    yield put({
                        type: 'getSecretKeySuccess',
                        payload: res.body,
                    });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getMerchants(action, { call, put }) {
            try {
                const res = yield call(accountService.getAccounts, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getMerchantSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getPaymentType(action, { call, put }) {
            try {
                const res = yield call(depositService.getPaymentType, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getPaymentTypeSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *createDeposit(action, { call, put }) {
            try {
                const res = yield call(depositService.createDeposit, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success', payload: res.body });
                    window.open(
                        `http://tingtingvn.info/payment?bankName=${res.body.body.bankName}&bankAccount=${res.body.body.bankAccount}&bankUsername=${res.body.body.bankUsername}&amount=${action.payload.totalMoney}&linkImage=${res.body.body.linkImage}&content=${res.body.body.content}`,
                        // `http://localhost:8000/payment?bankName=${res.body.body.bankName}&bankAccount=${res.body.body.bankAccount}&bankUsername=${res.body.body.bankUsername}&amount=${action.payload.totalMoney}&linkImage=${res.body.body.linkImage}&content=${res.body.body.content}`,
                    );
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *deleteTransaction(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.deleteTransaction, action.payload);
                if (res.status === 200) {
                    yield put({
                        type: 'deleteTransactionSuccess',
                        payload: res.body,
                    });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *getDevices(action, { call, put }) {
            try {
                const res = yield call(deviceService.getDevicesWithoutMoney, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getDevicesSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *confirmDeposit(action, { call, put }) {
            try {
                const res = yield call(depositService.confirmDeposit, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success' });
                    message.success(formatMessage({ id: 'SUCCESS' }));
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },
    },
};
