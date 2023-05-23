import { ADMIN_KEY, TOKEN_KEY } from '@/config/constant';
import accountService from '@/services/account';
import authService from '@/services/auth';
import depositService from '@/services/deposit';
import deviceService from '@/services/device';
import masterService from '@/services/masterData';
import { handleErrorModel, handleRemoveLocal } from '@/util/function';
import { message } from 'antd';
import { router } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';

export default {
    namespace: 'MASTERDATA',
    state: {
        loading: false,
        loginLoading: false,
        isLogin: false,
        changePasswordSuccess: false,
        myProfile: {},
        updateProfileResponse: {},
        mailResponse: undefined,
        loginResponse: {},
        detailAccount: {},
        devices: [],
        listPaymentType: [],
        balanceTelecom: undefined,
    },

    reducers: {
        loading(state) {
            return {
                ...state,
                loading: true,
            };
        },
        error(state) {
            return {
                ...state,
                loading: false,
            };
        },

        changePasswordSuccess(state) {
            return {
                ...state,
                loading: false,
                changePasswordSuccess: true,
                isFirstLogin: false,
            };
        },

        startLogin(state) {
            return {
                ...state,
                loginLoading: true,
            };
        },

        loginSuccess(state, action) {
            console.log({ payloadAccessToken: action.payload.body });
            const { accessToken } = action.payload.body;
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(ADMIN_KEY, JSON.stringify(action.payload.body));
            message.success(formatMessage({ id: 'LOGIN_SUCCESS' }));
            return {
                ...state,
                isLogin: true,
                loginLoading: false,
            };
        },

        loginFail(state, action) {
            return {
                ...state,
                loginLoading: false,
            };
        },
        logoutSuccess(state, action) {
            handleRemoveLocal();
            return {
                ...state,
                isLogin: false,
            };
        },

        getMyProfileSuccess(state, action) {
            return {
                ...state,
                myProfile: action.payload,
                loading: false,
            };
        },

        updateProfileSuccess(state, action) {
            return {
                ...state,
                updateProfileResponse: action.payload,
                loading: false,
            };
        },

        stepOneSuccess(state, action) {
            return {
                ...state,
                loginLoading: false,
                mailResponse: action.payload.body,
            };
        },

        getDetailAccountSuccess(state, action) {
            return {
                ...state,
                detailAccount: action.payload.body,
            };
        },

        resetMailSuccess(state, action) {
            return {
                ...state,
                mailResponse: undefined,
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

        getPaymentTypeSuccess(state, action) {
            return {
                ...state,
                listPaymentType: action.payload.body,
            };
        },

        getBalanceTelecomSuccess(state, action) {
            return {
                ...state,
                balanceTelecom: action.payload.body,
            };
        },
    },

    effects: {
        *changePassword(action, { call, put }) {
            try {
                const res = yield call(authService.changePassword, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'changePasswordSuccess' });
                    message.success(res.body.message);
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },

        *login(action, { call, put }) {
            yield put({ type: 'startLogin' });
            try {
                const res = yield call(authService.login, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'stepOneSuccess', payload: res.body });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'loginFail' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'loginFail' });
            }
        },

        *logout(action, { call, put }) {
            yield put({ type: 'logoutSuccess' });
            router.push('/login');
        },

        *getMyProfile(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(masterService.getMyProfile, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getMyProfileSuccess', payload: res.body.data });
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },
        *updateProfile(action, { call, put }) {
            yield put({ type: 'loading' });
            try {
                const res = yield call(masterService.updateProfile, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'updateProfileSuccess', payload: res.body });
                    message.success(res.body.message);
                } else {
                    message.error(res.body.message);
                    yield put({ type: 'error' });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'error' });
            }
        },
        *verifyOtp(action, { call, put }) {
            yield put({ type: 'startLogin' });
            try {
                const verifyOtpPayload = {
                    code: action.payload.code,
                    phone: action.payload.phone, // note: todo later.
                };

                const resVerify = yield call(authService.verifyOtp, verifyOtpPayload);
                if (resVerify.status === 200) {
                    yield put({ type: 'loginSuccess', payload: resVerify.body });
                }
            } catch (error) {
                handleErrorModel(error);
                yield put({ type: 'loginFail' });
            }
        },

        *resetMail(action, { call, put }) {
            yield put({ type: 'resetMailSuccess' });
        },

        *getDetailAccount(action, { call, put }) {
            try {
                const res = yield call(accountService.getDetailAccount, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getDetailAccountSuccess', payload: res.body });
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

        *transferBalance(action, { call, put }) {
            try {
                const res = yield call(deviceService.transferBalance, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'transferBalanceSuccess', payload: res.body });
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
        *transferBalanceOutside(action, { call, put }) {
            try {
                const res = yield call(deviceService.transferBalanceOutside, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'transferBalanceSuccess', payload: res.body });
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

        *getBalanceTelecom(action, { call, put }) {
            try {
                const res = yield call(depositService.getBalanceTelecom, action.payload);
                if (res.status === 200) {
                    yield put({ type: 'getBalanceTelecomSuccess', payload: res.body });
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
