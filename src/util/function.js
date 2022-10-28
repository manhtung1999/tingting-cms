import { message } from 'antd';
import * as constants from '@/config/constant';
import moment from 'moment';
import cookies from 'js-cookie';
export const generateOtp = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const handleErrorModel = error => {
    console.log('error', error);
    try {
        var data = JSON.parse(error.message);
        message.error(data.message);
    } catch (error) {
        message.error('Có lỗi xảy ra!');
    }
};

export const handleRemoveLocal = () => {
    localStorage.removeItem(constants.TOKEN_KEY);
    localStorage.removeItem(constants.ADMIN_KEY);
};

//  generate unique id
export const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
};

export const statusLogin = {
    FIRST_LOGIN: 0,
    PASSWORD_EXPIRED: 1,
    LOGIN_SUCCESS: 2,
};

export const checkPasswordExpired = passwordExpiredAt => {
    var status = statusLogin.LOGIN_SUCCESS;
    if (passwordExpiredAt === null) {
        status = statusLogin.FIRST_LOGIN;
    } else if (moment() > moment(passwordExpiredAt)) {
        status = statusLogin.PASSWORD_EXPIRED;
    }
    return status;
};

export function formatVnd(amount) {
    return amount ? amount.toLocaleString('en-US', { style: 'currency', currency: 'VND' }) : 0;
}

/* eslint-disable no-template-curly-in-string */
export const validateMessages = {
    required: 'Bạn chưa nhập ${label}',
};
/* eslint-enable no-template-curly-in-string */

export function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
