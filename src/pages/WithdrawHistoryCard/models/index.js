import { message } from 'antd';
import { handleErrorModel } from '@/util/function';
import depositService from '@/services/deposit';
import deviceService from '@/services/device';
import accountService from '@/services/account';
import { formatMessage } from 'umi-plugin-react/locale';

export default {
    namespace: 'WITHDRAW_CARD',
    state: {
        loading: false,
        listWithdraw: [],
        totalRow: 0,
        devices: [],
        listMerchant: [],
        listAgent: [],
        listPaymentType: [],
        detailTrans: undefined,
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

        getWithdrawSuccess(state, action) {
            return {
                ...state,
                loading: false,
                listWithdraw: action.payload.body.transaction,
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

        getDetailTransSuccess(state, action) {
            return {
                ...state,
                detailTrans: action.payload.body,
            };
        },
    },

    effects: {
        *getWithdraws(action, { call, put }) {
            try {
                const res = yield call(depositService.getDeposits, action.payload);
                if (res.status === 200) {
                    yield put({
                        type: 'getWithdrawSuccess',
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

        *getAgents(action, { call, put }) {
            try {
                const res = yield call(accountService.getAccounts, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getAgentSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *createWithdraw(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.createWithdraw, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success', payload: res.body });
                    message.success(formatMessage({ id: 'CREATE_WITHDRAW_SUCCESS' }));
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
        *refreshCard(action, { call, put }) {
            try {
                const res = yield call(depositService.refreshCard, action.payload);
                if (res.status === 200) {
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

        *getDetailTrans(action, { call, put }) {
            try {
                const res = yield call(depositService.getDetailTrans, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getDetailTransSuccess', payload: res.body });
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
