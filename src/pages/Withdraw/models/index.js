import { message } from 'antd';
import { handleErrorModel } from '@/util/function';
import depositService from '@/services/deposit';
import deviceService from '@/services/device';
import accountService from '@/services/account';
import { formatMessage } from 'umi-plugin-react/locale';

export default {
    namespace: 'WITHDRAW',
    state: {
        loading: false,
        listWithdraw: [],
        totalRow: 0,
        devices: [],
        listMerchant: [],
        listAgent: [],
        deleteResponse: undefined,
        listCardBank: [],
        listPaymentType: [],
        addCardResponse: undefined,
        denyResponse: undefined,
        approveResponse: undefined,
        appConfirmResponse: undefined,
        deleteCardResponse: undefined,
        withdrawTelecom: undefined,
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
        getDevicesSuccess(state, action) {
            return {
                ...state,
                devices: action.payload.body,
            };
        },
        getMerchantSuccess(state, action) {
            return {
                ...state,

                listMerchant: action.payload.body,
            };
        },

        getAgentSuccess(state, action) {
            return {
                ...state,
                listAgent: action.payload.body,
            };
        },

        getCardBankSuccess(state, action) {
            console.log('action', action.payload);
            return {
                ...state,
                listCardBank: action.payload.body,
            };
        },

        deleteTransactionSuccess(state, action) {
            return {
                ...state,
                loading: false,
                deleteResponse: action.payload.body,
            };
        },

        getPaymentTypeSuccess(state, action) {
            return {
                ...state,
                listPaymentType: action.payload.body,
            };
        },
        createCardBankSuccess(state, action) {
            return {
                ...state,
                addCardResponse: action.payload.body,
            };
        },

        denyTransactionSuccess(state, action) {
            return {
                ...state,
                loading: false,
                denyResponse: action.payload,
            };
        },

        approveTransactionSuccess(state, action) {
            return {
                ...state,
                loading: false,
                approveResponse: action.payload,
            };
        },

        appConfirmMoneySuccess(state, action) {
            return {
                ...state,
                loading: false,
                appConfirmResponse: action.payload,
            };
        },

        deleteCardBankSuccess(state, action) {
            return {
                ...state,
                deleteCardResponse: action.payload,
            };
        },

        createWithdrawTelecomSuccess(state, action) {
            return {
                ...state,
                withdrawTelecom: action.payload,
                loading: false,
            };
        },

        closeModalDetailSuccess(state, action) {
            return {
                ...state,
                withdrawTelecom: undefined,
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

        *createWithdraw(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.createWithdraw, action.payload);
                if (res.status === 200) {
                    console.log('res.body.body', res.body.body);
                    yield put({ type: 'createWithdrawTelecomSuccess', payload: res.body.body });
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
        *getCardBank(action, { call, put }) {
            try {
                const res = yield call(depositService.getCardBank, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getCardBankSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *createCardBank(action, { call, put }) {
            try {
                const res = yield call(depositService.createCardBank, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'createCardBankSuccess', payload: res.body });
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

        *denyTransaction(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.denyTransaction, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'denyTransactionSuccess', payload: res.body });
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

        *approveTransaction(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.approveTransaction, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'approveTransactionSuccess', payload: res.body });
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

        *appConfirmMoney(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(depositService.appConfirmMoney, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'appConfirmMoneySuccess', payload: res.body });
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

        *deleteCardBank(action, { call, put }) {
            try {
                const res = yield call(depositService.deleteCardBank, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'deleteCardBankSuccess', payload: res.body });
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

        *closeModalDetail(action, { call, put }) {
            yield put({ type: 'closeModalDetailSuccess' });
        },
    },
};
