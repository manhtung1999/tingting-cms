import { message } from 'antd';
import { handleErrorModel } from '@/util/function';
import depositService from '@/services/deposit';
import accountService from '@/services/account';
import deviceService from '@/services/device';
import { formatMessage } from 'umi-plugin-react/locale';
export default {
    namespace: 'ADMIN',
    state: {
        loading: false,
        listPaymentType: [],
        listMerchant: [],
        devices: [],
        listCardBank: [],
        deleteCardResponse: undefined,
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
            };
        },

        getPaymentTypeSuccess(state, action) {
            return {
                ...state,
                listPaymentType: action.payload.body,
            };
        },

        getMerchantSuccess(state, action) {
            return {
                ...state,
                listMerchant: action.payload.body,
            };
        },
        getDevicesSuccess(state, action) {
            return {
                ...state,
                devices: action.payload.body,
            };
        },

        getCardBankSuccess(state, action) {
            return {
                ...state,
                listCardBank: action.payload.body,
            };
        },

        deleteCardBankSuccess(state, action) {
            return {
                ...state,
                deleteCardResponse: action.payload,
            };
        },
    },

    effects: {
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

        *configUSDT(action, { call, put }) {
            try {
                const res = yield call(accountService.configUSDT, action.payload);
                if (res.status === 200) {
                    message.success(formatMessage({ id: 'SUCCESS' }));
                    yield put({ type: 'success' });
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
                const res = yield call(deviceService.getDevices, action.payload);
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

        *createDeposit(action, { call, put }) {
            try {
                const res = yield call(depositService.adminCreateDeposit, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'success', payload: res.body });
                    window.open(
                        `http://tingtingvn.info/payment?bankName=${res.body.body.bankName}&bankAccount=${res.body.body.bankAccount}&bankUsername=${res.body.body.bankUsername}&amount=${action.payload.totalMoney}&linkImage=${res.body.body.linkImage}&content=${res.body.body.content}&walletAddress=${res.body.body.walletAddress}`,
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

        *createWithdraw(action, { call, put }) {
            try {
                const res = yield call(depositService.adminCreateWithdraw, action.payload);
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

        *getUserCard(action, { call, put }) {
            try {
                const res = yield call(depositService.getUserCard, action.payload);
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
    },
};
